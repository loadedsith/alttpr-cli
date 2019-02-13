const ROM = require('./rom.js');
const fs = require('fs');


const loadFile = (file) => {
  console.log({file});
  return ROM(fs.readFileSync(file), (rom) => {
    console.log('loaded');
    let patch = require('./base_patch.json');
    let daily = require('./daily.json');
    rom.setBasePatch(patch)

    rom.parsePatch(daily).then((rom) => {
        rom.setBasePatch(patch);
        rom.save('n_' + downloadFilename() + '.sfc');
    });

    // rom.reset().then((rom_) => {
    //   parsePatch();
    //   save(downloadFilename() + '.sfc');
    // })
  }, () => {
    console.log('error')
  })
}

module.exports = {
  ROM,
  loadFile
};
