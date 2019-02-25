const ROM = require('./rom.js');
const {getSprite} = require('./sprites.js');
const fs = require('fs');
const vt_base_patch = require('./vt_base_patch.json');
const current_rom_hash = require('./current_rom_hash.json');

const s3_prefix = "https://s3.us-east-2.amazonaws.com/alttpr-patches";

const patchRomFromJSON = (rom) => {
  return new Promise((resolve, reject) => {
    if (typeof vt_base_patch !== 'undefined') {
      if (!Array.isArray(vt_base_patch)) {
        return reject('base patch corrupt');
      }
      return rom.parsePatch({patch: vt_base_patch}).then((rom) => {
        rom.setBasePatch(vt_base_patch);
        resolve(rom);
      });
    }
  });
};


const buildRom = (file,
    quickswap=false,
    musicVolume=false,
    menuSpeed='normal',
    heartColor='red',
    heartSpeed='normal',
    spriteName='Link',
    patch='./daily.json',
    savePath='./') => {
  let readyRom = new Promise((resolve, reject) => {
    new ROM(fs.readFileSync(file), (rom) => {
        patchRomFromJSON(rom).then((rom) => {
          if (rom.checkMD5() != current_rom_hash) {
            console.log('error', 'error.bad_file');
            reject();
            return;
          }

          rom.parsePatch(require(patch)).then(() => {
            resolve(rom);
          });

        }).catch(reject);
    });
  })

  return new Promise((resolve, reject) => {
    Promise.all([
        getSprite(spriteName),
        readyRom,
      ]).then(([sprite, rom]) => {
        rom.setQuickswap(quickswap);
        rom.setMusicVolume(musicVolume);
        rom.setHeartColor(heartColor);
        if (menuSpeed && menuSpeed !== 'normal') {
          rom.setMenuSpeed(menuSpeed);
        }
        if (heartSpeed && heartSpeed !== 'normal') {
          rom.setHeartSpeed(heartSpeed);
        }
        rom.parseSprGfx(sprite);
        rom.save(`${savePath}${rom.downloadFilename()}.sfc`);
        resolve(rom)
      }).catch((e) => {
        console.log('error', e)
        reject(e);
      });
  })

}

module.exports = {
  ROM,
  buildRom,
};
