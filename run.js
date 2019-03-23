#!/usr/bin/env node
const randomizerCLI = require('./index.js');
const {
  getGameListFromPatch,
  getCurrentRomHash,
  getCurrentBasePatch,
  getCurrentDailyPatch,
  getPatch,
} = require('./updateDaily.js');
const path = require('path');
const fs = require('fs');

const randomChoice = function(choices) {
  return choices[Math.floor(Math.random() * choices.length)]
};


// Colors reference
const c = {
  'Bright': "\x1b[1m",
  'Dim': "\x1b[2m",
  'Underscore': "\x1b[4m",
  'Blink': "\x1b[5m",
  'Reverse': "\x1b[7m",
  'Hidden': "\x1b[8m",
  'Reset': "\x1b[0m",
};

require('yargs')
    .usage('Usage: $0 <command> [options]')

    .command({
      command: 'gamelist $0',
      aliases: ['x', 'xml'],
      desc: 'Get a game list xml for patch',
      handler: (argv) => {
        console.log(getGameListFromPatch(argv.$0).xml);
      },
    })

    .command({
      command: 'check',
      aliases: ['c'],
      desc: 'Check if this is the latest edition of alttpr-cli',
      handler: (argv) => {
        console.log('Checking for current version.');
        randomizerCLI.checkForUpdates().then((results) => {
          if (results.behind) {
            parentVersion = fs.readFileSync(
                path.join(__dirname, '.parent-version'), 'utf8');
            console.log('Behind by at least one version. Current parent' +
                ` version: ${parentVersion.slice(0,8)}. Latest parent` +
                ` ${results.hash.slice(0,8)}`);
          } else {
            console.log('You\'re on the latest, which is' +
                ` ${results.parentVersion.slice(0,8)}.`);
          }
        }).catch((e) => {
          throw e
        })
      }
    })

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
        let bashPair = function(label, value, level=false) {
          if (typeof value !== 'undefined') {
            let highlight = level ? c.Bright : c.Dim;
            return (`${c.Underscore}${label}${c.Reset}:`+
              ` ${highlight}${value}${c.Reset}\n`)
          }
          return '';
        }
        console.log('Building rom with these customizations: ');
        let customizations = [
          bashPair('Sprite Name', spriteName, 1),
          bashPair('Music Volume', musicVolume),
          bashPair('Menu Speed', menuSpeed),
          bashPair('Heart Color', heartColor),
          bashPair('Heart Speed', heartSpeed),
          bashPair('Quickswap', quickswap),
          bashPair('Spoiler', spoiler),
          bashPair('Patch', patch),
        ];

        console.log(customizations.join(''))

        randomizerCLI.buildRom(rom,
          quickswap,
          musicVolume,
          menuSpeed,
          heartColor,
          heartSpeed,
          spriteName,
          patch,
        ).then((rom) => {
          console.log('Built rom with these patch settings: ');
          let patchSettings = [
            bashPair('Goal', rom.goal, 1),
            bashPair('Mode', rom.mode, 1),
            bashPair('Difficulty', rom.difficulty, 1),
            bashPair('Difficulty Mode', rom.difficulty_mode, 1),
            bashPair('Notes', rom.notes),
            bashPair('Special', rom.special),
            bashPair('Weapons', rom.weapons, 1),
            bashPair('Shuffle', rom.shuffle, 1),
            bashPair('Rom Mode', rom.rom_mode, 1),
            bashPair('Variation', rom.variation, 1),
            '\n',
            bashPair('Tournament', rom.tournament),
            bashPair('Logic', rom.logic),
            bashPair('Name', rom.name),
            bashPair('Hash', rom.hash),
            bashPair('Build', rom.build),
            bashPair('Generated', rom.generated),
          ]
          console.log(patchSettings.join(''));
          console.log(`\x1b[0mReset`);

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

