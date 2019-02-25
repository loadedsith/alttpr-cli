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
  getCurrentBasePatch,
  getDaily,
};
