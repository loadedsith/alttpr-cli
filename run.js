const randomizerCLI = require('./index.js')
const {getCurrentRomHash, getCurrentBasePatch, getCurrentDailyPatch} =
    require('./updateDaily.js');

const {
  rom,
  patch,
  quickswap,
  musicVolume,
  menuSpeed,
  heartColor,
  heartSpeed,
  spriteName,
  spoiler,
} = require('yargs')
    .usage('Usage: $0 <command> [options]')

    .command({
      command: 'update',
      aliases: ['u'],
      desc: 'Update daily rom',
      handler: (argv) => {
        Promise.all([
          getCurrentRomHash(),
          getCurrentBasePatch(),
          getCurrentDailyPatch(),
        ]).then(() => {
          console.log('Updated complete');
          process.exit();
        })
      }
    })

    .example('$0 -r "./Zelda no Densetsu - Kamigami no Triforce (Japan).sfc" -p "./daily.json"', 'Build a rom.')

    .alias('r', 'rom')
    .nargs('r', 1)
    .describe('r', 'Specify rom.')
    .default('r', './Zelda no Densetsu - Kamigami no Triforce (Japan).sfc')

    .alias('p', 'patch')
    .nargs('p', 1)
    .default('p', './daily.json')
    .describe('p', 'Specify patch.')

    .alias('t', 'spriteName')
    .nargs('t', 1)
    .default('t', 'Link')
    .describe('t', 'Sprite name.')

    .alias('h', 'heartColor')
    .nargs('h', 1)
    .default('h', 'red')
    .describe('h', 'Heart color. Choices blue, green, yellow or red. ')

    .alias('s', 'heartSpeed')
    .nargs('s',  1)
    .default('s', 'normal')
    .describe('s', 'Health alert tone frequency. Choices instant, fast, ' +
        'normal, or slow')

    .alias('z', 'spoiler')
    .nargs('z',  1)
    .default('z', false)
    .describe('z', 'Print spoiler log after building')

    .alias('m', 'menuSpeed')
    .nargs('m',  1)
    .default('m', 'normal')
    .describe('m', 'Menu speed. Choices instant, fast, ' +
        'normal, or slow')

    .alias('q', 'quickswap')
    .nargs('q',  1)
    .default('q', false)
    .describe('q', 'Quick swap items with L or R.')

    .alias('v', 'musicVolume')
    .nargs('v',  1)
    .default('v', false)
    .describe('v', 'Music volume. Disable for MSU-1 support.')

    .help('?')
    .alias('?', 'help')
    .argv

console.log('Building rom with these customizations: ');
console.log({
  quickswap,
  musicVolume,
  menuSpeed,
  heartColor,
  heartSpeed,
  spriteName,
});
randomizerCLI.buildRom(rom,
  quickswap,
  musicVolume,
  menuSpeed,
  heartColor,
  heartSpeed,
  spriteName,
).then((rom) => {
  console.log('Building rom with these patch settings: ');

  console.log({
    logic: rom.logic,
    difficulty: rom.difficulty,
    mode: rom.mode,
    name: rom.name,
    build: rom.build,
    logic: rom.logic,
    weapons: rom.weapons,
    rom_mode: rom.rom_mode,
    variation: rom.variation,
    difficulty: rom.difficulty,
    tournament: rom.tournament,
    hash: rom.hash,
    size: rom.size,
    generated: rom.generated,
  });

  if (spoiler) {
    console.log({
      spoiler: rom.spoiler,
    });
  }

  console.log('Built!')
});
