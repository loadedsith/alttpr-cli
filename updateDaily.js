const zlib = require('zlib');
const https = require('https');
const fs = require('fs');

let dailyRequest;
let dailyResolve;
let dailyReject;

let dailyPromise = new Promise((resolve, reject) => {
  dailyResolve = resolve;
  dailyReject = reject;
});

const getDaily = () => {
  if (!dailyRequest) {
    dailyRequest =
      https.get('https://alttpr.com/en/daily', (response) => {
        let body = '';

        if (response.statusCode == 200 && response.statusCode < 299) {
          response.on('data', function(chunk) {
            body += chunk;
          });
          response.on('end', function() {
            dailyRequest = body;
            dailyResolve(dailyRequest);
          });

        } else {
          dailyReject(`Failed to download daily. ${JSON.stringify(response)}`);
        }
      });

  }

  return dailyPromise;
};

const getCurrentRomHash = (path='./current_rom_hash.json', write=true) => {
  return new Promise((resolve, reject) => {
    getDaily().then((body) => {
      body = body.split('\n');
      body = body.find((line) => {
        return line.indexOf('current_rom_hash = ')> -1
      })

      const hash = body.match(/var current_rom_hash = '([^'\n;]*)/)[1]

      if (write) {
        fs.writeFileSync(path, `"${hash}"`);
      }

      resolve(hash)
    }).catch(reject);
  })
};

const getPatch = (hash, saveAs, write=true) => {
  if (!saveAs) {
    saveAs = hash;
  }
  return new Promise((resolve, reject) => {
    let buffer = [];

    https.get('https://s3.us-east-2.amazonaws.com/' +
        `alttpr-patches/${hash}.json`, (response) => {
      if (response.statusCode == 200 && response.statusCode < 299) {
        let gunzip = zlib.createGunzip();
        response.pipe(gunzip);

        gunzip.on('data', function(data) {
          // decompression chunk ready, add it to the buffer
          buffer.push(data.toString());

        }).on('end', function() {
          // response and decompression complete, join the buffer and return
          let body = buffer.join('');
          fs.writeFileSync(`${saveAs}.json`, body);
          resolve(body);
        }).on('error', function(e) {
          reject(e);
        })
      } else {
        reject(`Failed to download patch. ${JSON.stringify(response)}`);
      }
    });
  });
};

const getCurrentDailyPatch = (path='./daily.json', write=true) => {
  return new Promise((resolve, reject) => {
    getCurrentDailyHash('', false).then((hash) => {
      getPatch(hash, 'daily');
    });
  });
};

const getCurrentDailyHash = (path='./dailyHash.json', write=true) => {
  return new Promise((resolve, reject) => {
    getDaily().then((body) => {
      body = body.split('\n');
      body = body.find((line) => {
        return line.indexOf('hash="')> -1
      })

      const hash = body.match(/\shash="([^"]*)">/)[1]

      if (write) {
        fs.writeFileSync(path, `"${hash}"`);
      }

      resolve(hash)
    }).catch(reject);
  })
};

const getCurrentBasePatch = (path='./base_patch.json', write=true) => {
  return new Promise((resolve, reject) => {
    getDaily().then((body) => {
      body = body.split('\n');
      body = body.find((line) => {
        return line.indexOf('vt_base_patch = ')> -1
      });

      const patch = body.match(/var vt_base_patch = ([^'\n;]*)/)[1];

      if (write) {
        fs.writeFileSync(path, patch);
      }

      resolve(body.match(/var vt_base_patch = ([^'\n;]*)/)[1])
    }).catch(reject);
  })
};

module.exports = {
  getCurrentRomHash,
  getCurrentDailyPatch,
  getCurrentDailyHash,
  getCurrentBasePatch,
  getDaily,
  getPatch,
};
