const ROM = require('./rom.js');
const fs = require('fs');


const loadFile = (file) => {
  console.log({file});
  return ROM(fs.readFileSync(file), (rom) => {
    console.log('loaded');
    rom.setBasePatch(require('./base_patch.json'))
    rom.reset().then((rom_) => {

      save(downloadFilename() + '.sfc');
    })
  }, () => {
    console.log('error')
  })
}

module.exports = {
  ROM,
  loadFile
};
