const zlib = require('zlib');
const https = require('https');
const fs = require('fs');

const downloadFilename = function(patch) {
  return patch.name
    || 'ALttP - VT_' + patch.logic
    + '_' + patch.difficulty
    + '-' + patch.mode
    + (patch.weapons ? '_' + patch.weapons : '')
    + '-' + patch.goal
    + (patch.variation == 'none' ? '' : '_' + patch.variation)
    + '_' + patch.hash
    + (patch.special ? '_special' : '');
};

let dailyRequest;
let dailyResolve;
let dailyReject;

let dailyPromise = new Promise((resolve, reject) => {
  dailyResolve = resolve;
  dailyReject = reject;
});

function pad(n){return n<10 ? '0'+n : n};

const getGameListFromPatch = (patch='daily.json', buildConfig) => {
  const {logic, difficulty, spoiler, hash, size, generated} =
      JSON.parse(fs.readFileSync(patch, 'utf8'));

  patch = {
      logic, difficulty, spoiler, hash, size, generated
  };

  const filename = downloadFilename(spoiler.meta);

  let release = new Date(generated);
  release = `${release.getFullYear()}${pad(release.getMonth() + 1)}` +
      `${pad(release.getDate() + 1)}T${pad(release.getHours())}` +
      `${pad(release.getSeconds())}00`;

  return {
    filename,
    patch,
    xml: `<game>
  <path>${filename}.sfc</path>
  <name>ALttP:R - ${filename}</name>
  <desc>A Link to the Past: Randomizer - ${filename}

  Goal: ${spoiler.meta.goal},
  Mode: ${spoiler.meta.mode},
  Logic: ${spoiler.meta.logic},
  Weapons: ${spoiler.meta.weapons},
  Rom mode: ${spoiler.meta.rom_mode},
  Variation: ${spoiler.meta.variation},
  Difficulty: ${spoiler.meta.difficulty},
  Difficulty mode: ${spoiler.meta.difficulty_mode},
  Tournament: ${spoiler.meta.tournament},
  Build: ${spoiler.meta.build},
  Generated: ${generated}

${buildConfig ? `Build Config: ${JSON.stringify(buildConfig, null, 2)}`: ''}

  ALttP: Randomizer is a new take on the classic game The Legend of Zelda: A Link to the Past. Each playthrough shuffles the location of all the important items in the game. Will you find the Bow atop Death Mountain, the Fire Rod resting silently in the library, or even the Master Sword itself waiting in a chicken coop?

  Challenge your friends to get the fastest time on a particular shuffle or take part in the weekly speedrun competition. Hone your skills enough and maybe you&#x2019;ll take home the crown in our twice-yearly invitational tournament. See you in Hyrule!
  </desc>
  <image>./media/screenshots/A Link To the Past Randomizer.png</image>
  <marquee>./media/marquees/A Link To the Past Randomizer.png</marquee>
  <releasedate>${release}</releasedate>
  <developer>Veetorp, Karkat, Christos0wen, Smallhacker and Dessyreqt<developer/>
  <publisher>alttpr.com<publisher/>
</game>`,
  }
};

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
  getGameListFromPatch,
  getCurrentRomHash,
  getCurrentDailyPatch,
  getCurrentDailyHash,
  getCurrentBasePatch,
  getDaily,
  getPatch,
};
