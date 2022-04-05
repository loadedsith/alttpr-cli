const cp = require('child_process');
const fs = require('fs');
const {
  getGameListFromPatch,
  getCurrentDailyHash,
  getCurrentRomHash,
  getCurrentBasePatch,
  getDaily,
} = require('./updateDaily.js');

const nock = require('nock');

const scope = nock('https://alttpr.com')
  .get('/en/daily')
  .reply(200, (uri, requestBody, cb) => {
    fs.readFile(`./spec/daily/www/daily`, cb); // Error-first callback
  });

nock.disableNetConnect();

describe('Daily update', () => {
  beforeAll(() => {
    let removeTestFiles = [
      './spec/daily/workspace/current_rom_hash.json',
      './spec/daily/workspace/base_patch.json',
    ];
    removeTestFiles.forEach((file) => {
      if (fs.existsSync(file)) {
        fs.unlink(file, (err) => {
          if (err) {
            throw err
          };
          console.log(`${file} was deleted`);
        });
      }
    })
  });

  it('generate XML from a patch', () => {
    let xml = `<game>
  <path>Daily Challenge: Apr 5, 2022.sfc</path>
  <name>ALttP:R - Daily Challenge: Apr 5, 2022</name>
  <desc>A Link to the Past: Randomizer - Daily Challenge: Apr 5, 2022

  Goal: ganon,
  Mode: retro,
  Logic: NoGlitches,
  Weapons: vanilla,
  Rom mode: NoGlitches,
  Variation: undefined,
  Difficulty mode: undefined,
  Tournament: true,
  Build: 2022-01-03,
  Generated: 2022-04-05T00:01:01+00:00



  ALttP: Randomizer is a new take on the classic game The Legend of Zelda: A Link to the Past. Each playthrough shuffles the location of all the important items in the game. Will you find the Bow atop Death Mountain, the Fire Rod resting silently in the library, or even the Master Sword itself waiting in a chicken coop?

  Challenge your friends to get the fastest time on a particular shuffle or take part in the weekly speedrun competition. Hone your skills enough and maybe you&#x2019;ll take home the crown in our twice-yearly invitational tournament. See you in Hyrule!
  </desc>
  <image>./media/screenshots/A Link To the Past Randomizer.png</image>
  <genre>Randomized, Fantasy, Rpg, Topdown, Wanderer</genre>
  <marquee>./media/marquees/A Link To the Past Randomizer.png</marquee>
  <releasedate>20220405T190100</releasedate>
  <developer>Veetorp, Karkat, Christos0wen, Smallhacker and Dessyreqt</developer>
  <publisher>alttpr.com</publisher>
</game>`;
    expect(getGameListFromPatch).not.toBeUndefined();
    expect(getGameListFromPatch('./spec/daily/www/daily.json'))
        .not.toBeUndefined();
    let newXml = getGameListFromPatch('./spec/daily/www/daily.json').xml;

    let splitXml = xml.split('\n');


    let splitNewXml = newXml.split('\n');
    splitNewXml.forEach((line, i) => {
      expect(line).toEqual(splitXml[i])
    })
    expect(getGameListFromPatch('./spec/daily/www/daily.json')).toEqual({
      filename:'Daily Challenge: Apr 5, 2022',
      patch: {
        logic: 31,
        difficulty: undefined,
        spoiler: {
          meta: {
            goal: 'ganon',
            mode: 'retro',
            name: 'Daily Challenge: Apr 5, 2022',
            build: '2022-01-03',
            logic: 'NoGlitches',
            weapons: 'vanilla',
            rom_mode: 'NoGlitches',
            tournament: true,
            size: 2,
            hints: 'off',
            worlds: 1,
            spoilers: 'off',
            world_id: 1,
            item_pool: 'normal',
            pseudoboots: false,
            accessibility: 'none',
            dungeon_items: 'standard',
            item_placement: 'basic',
            allow_quickswap: true,
            item_functionality: 'hard',
            'enemizer.enemy_damage': 'default',
            'enemizer.enemy_health': 'default',
            'enemizer.enemy_shuffle': 'shuffled',
            'enemizer.pot_shuffle': 'off',
            'enemizer.boss_shuffle': 'none',
            entry_crystals_ganon: 'random',
            entry_crystals_tower: 'random',
          }
        },
        hash: '4AvprPzgGn',
        size: 2,
        generated: '2022-04-05T00:01:01+00:00',
      },
      xml
    });
  });

  it('should get the current daily hash', (done) => {
    getCurrentDailyHash('./spec/daily/workspace/daily_hash.json')
        .then((hash) => {
      expect(hash).toBe('4AvprPzgGn');
      expect(fs.existsSync('./spec/daily/workspace/daily_hash.json'))
          .toBe(true);

      done();
    })
  });

  it('should get the current hash', (done) => {
    getCurrentRomHash('./spec/daily/workspace/current_rom_hash.json')
        .then((hash) => {
      expect(hash).toBe('18bf0a68227f767b73a07d5d1c3c1b01');
      expect(fs.existsSync('./spec/daily/workspace/current_rom_hash.json'))
          .toBe(true);

      done();
    })
  });

// I have no confidence in this test
  it('should get the current base patch', (done) => {
    getCurrentBasePatch('./spec/daily/workspace/base_patch.json')
        .then((patch) => {

      expect(Object.keys(patch).length).toBe(18);
      expect(fs.existsSync('./spec/daily/workspace/base_patch.json'))
          .toBe(true);

      done();
    })
  });
});

