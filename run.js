#!/usr/bin/env node
const randomizerCLI = require('./index.js')
const {getCurrentRomHash, getCurrentBasePatch, getCurrentDailyPatch, getPatch} =
    require('./updateDaily.js');

const randomChoice = function(choices) {
  return choices[Math.floor(Math.random() * choices.length)]
};

require('yargs')
    .usage('Usage: $0 <command> [options]')

    .command({
      command: 'daily',
      aliases: ['d', 'update', 'u'],
      desc: 'Update daily rom',
      handler: (argv) => {
        console.log('Getting daily');
        Promise.all([
          getCurrentRomHash(),
          getCurrentBasePatch(),
          getCurrentDailyPatch(),
        ]).then(() => {
          console.log('Update complete');
          process.exit();
        })
      }
    })

    .command({
      command: 'get',
      aliases: ['g', 'download'],
      desc: 'Download a permanent linked hash.',
      handler: (argv) => {
        let patch = argv._[1];
        console.log(`Getting patch ${patch}`);
        getPatch(patch).then(() => {
          console.log('Update complete');
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
    .default('h', 'red')
    .describe('h', 'Heart color')
    .choices('h', ['blue', 'green', 'yellow', 'red'])


    .alias('s', 'heartSpeed')
    .default('s', 'normal')
    .describe('s', 'Health alert tone frequency.')
    .choices('s', ['instant', 'fast', 'normal', 'slow'])

    .alias('z', 'spoiler')
    .nargs('z',  1)
    .default('z', false)
    .describe('z', 'Print spoiler log after building')

    .alias('m', 'menuSpeed')
    .default('m', 'normal')
    .describe('m', 'Menu speed.')
    .choices('m', ['instant', 'fast', 'normal', 'slow'])

    .alias('q', 'quickswap')
    .nargs('q',  1)
    .default('q', false)
    .describe('q', 'Quick swap items with L or R.')

    .alias('v', 'musicVolume')
    .nargs('v',  1)
    .default('v', true)
    .describe('v', 'Music volume. Disable for MSU-1 support.')

    .command({
      command: 'build',
      aliases: ['b'],
      desc: 'Update daily rom',
      handler: (argv) => {
        console.log('Building rom with these customizations: ');
        let {
          rom,
          quickswap,
          musicVolume,
          menuSpeed,
          heartColor,
          heartSpeed,
          spriteName,
          spoiler,
          patch,
        } = argv

        if (spriteName === 'random') {
          spriteName = randomChoice([
              'Link', 'Four Swords Link', 'Arrghus', 'Beau', 'Bewp', 'Big Key',
              'Blacksmith Link', 'Bob', 'Boo 2', 'Boo', 'Broccoli', 'Bronzor',
              'B.S. Boy', 'B.S. Girl', 'Cactuar', 'Casual Zelda',
              'Marvin the Cat', 'Cat Boo', 'CD-i Link', 'Celes', 'Cheep Cheep',
              'Cirno', 'Clifford', 'Conker', 'Cursor', 'Dark Boy',
              'Dark Girl', 'Dark Link (Tunic)', 'Dark Link', 'Dark Swatchy',
              'Dark Zelda', 'Dark Zora', 'Deadrock', 'Decidueye', 'Demon Link',
              'Dragonite', 'Eggplant', 'EmoSaru', 'Fox Link', 'Frog Link',
              'Ganondorf', 'Garfield', 'Goomba', 'GrandPOOBear',
              'Gruncle Stan', 'Headless Link', 'Hoarder (Bush)',
              'Hoarder (Pot)', 'Hoarder (Rock)', 'Homer Simpson',
              'Hyrule Knight', 'Ignignokt', 'Inkling', 'Invisible Link',
              'Jogurt', 'Kecleon', 'Kholdstare', 'Kirby', 'Kore8',
              'Lakitu', 'Hat Color Link', 'Tunic Color Link', 'Pony',
              'Luigi', 'Magus', 'Maiden', 'Manga Link', 'Maple Queen',
              'Mario (Classic)', 'Mario and Cappy', 'Marisa Kirisame',
              'Meatwad', 'Megaman X', 'Mike Jones', 'Minish Cap Link',
              'missingno', 'Modern Link', 'Mog', 'Mouse',
              'Power Up with Pride Mushroom', 'Nature Link', 'Navi',
              'Negative Link', ' NES Link', 'Ness (Earthbound)', 'Old Man',
              'Ori', 'Outline Link', 'Parallel Worlds Link', 'Penguin Link',
              'Phoenix Wright', 'Pikachu', 'Pink Ribbon Link', 'Plague Knight',
              'Pokey', 'Popoi', 'Pride Link', 'Psyduck', 'The Pug',
              'Purple Chest', 'Rainbow Link', 'Robo-Link 9000', 'Roy Koopa',
              'Rumia', 'Ryu', 'Sailor Moon', 'Samus', 'Santa Link', 'Scholar',
              'Shadow Sakura', 'Shantae', 'Shuppet', 'Shy Guy',
              'SNES Controller', 'Soda Can', 'Hyrule Soldier',
              'Sonic the Hedgehog', 'Sora', 'Squirtle', 'Static Link',
              'Super Bunny', 'Super Meat Boy', 'Swatchy', 'Tea Time',
              'Terra (Esper)', 'Thief', 'Tile', 'Tingle', 'TMNT', 'Toad',
              'Toadette', 'TotemLinks', 'Trogdor the Burninator', 'TP Zelda',
              'Ultros', 'Valeera', 'VanillaLink', 'Vitreous', 'Vivi', 'Vivian',
              'Will', 'wixB', 'Wizzrobe', 'Yunica Tovah', 'Zandra', 'Zelda',
              'Zero Suit Samus', 'Zora'
          ]);
        }

        console.log({
          quickswap,
          musicVolume,
          menuSpeed,
          heartColor,
          heartSpeed,
          spriteName,
          patch,
          spoiler,
        });

        randomizerCLI.buildRom(rom,
          quickswap,
          musicVolume,
          menuSpeed,
          heartColor,
          heartSpeed,
          spriteName,
          patch,
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
      }
    })


    .help('?')
    .alias('?', 'help')
    .argv

