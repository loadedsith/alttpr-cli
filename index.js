const ROM = require('./rom.js');
const fs = require('fs');
const vt_base_patch = require('./vt_base_patch.json');
const daily = require('./daily.json');
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
    heartSpeed='half',
    spriteName='./sprites/001.link.1.zspr') => {
  return new ROM(fs.readFileSync(file), (rom) => {
    patchRomFromJSON(rom).then((rom) => {
      if (rom.checkMD5() != current_rom_hash) {
        console.log('error', 'error.bad_file');
        return;
      }

      rom.parsePatch(daily).then((rom) => {
        rom.setQuickswap(quickswap);
        rom.setMusicVolume(musicVolume);
        rom.setMenuSpeed(menuSpeed);
        rom.setHeartColor(heartColor);
        rom.setHeartSpeed(heartSpeed);
        let sprite = fs.readFileSync(`./${spriteName}`);
        rom.parseSprGfx(sprite);
        rom.save('n_' + rom.downloadFilename() + '.sfc');
      })
    }).catch((e) => {
      console.log('error', e)
    });
  })

}

module.exports = {
  ROM,
  buildRom,
};
