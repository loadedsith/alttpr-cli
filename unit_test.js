const cp = require('child_process');
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

describe('output checksum', () => {
  it('compare daily', () => {
    let cmd = 'md5';
    let spawn = cp.spawnSync;
    let original = spawn(cmd, ['-q', './Daily Challenge_ Feb 13, 2019.sfc'], {encoding:'utf-8'});
    let modified = spawn(cmd, ['-q', './n_Daily Challenge: Feb 13, 2019.sfc'], {encoding:'utf-8'});
    // console.log(spawn(cmd, ['Daily Challenge_ Feb 13, 2019.sfc']).)

    expect(original.stdout.replace('\n', ''))
        .toEqual(modified.stdout.replace('\n', ''));

  });
})
