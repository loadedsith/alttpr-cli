
const randomizerCLI = require('./index.js');

describe('rom', () => {
  it('should load', () => {
    expect(randomizerCLI.ROM).not.toBeUndefined();
  });

  it('should readFileToBlob', () => {
    console.log(randomizerCLI.loadFile('./Zelda no Densetsu - Kamigami no Triforce (Japan).sfc'))//.then(() => {
      // done()
    // })
  });
})
