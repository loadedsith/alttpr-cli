const cp = require('child_process');
const randomizerCLI = require('./index.js');

describe('rom', () => {
  it('should load', () => {
    expect(randomizerCLI.ROM).not.toBeUndefined();
  });

  it('should build a rom', () => {
    randomizerCLI.buildRom('./Zelda no Densetsu - Kamigami no' +
        ' Triforce (Japan).sfc');
  });
});

