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
  <path>Daily Challenge: Feb 13, 2019.sfc</path>
  <name>ALttP:R - Daily Challenge: Feb 13, 2019</name>
  <desc>A Link to the Past: Randomizer - Daily Challenge: Feb 13, 2019

  Goal: ganon,
  Mode: open,
  Logic: no-glitches-30,
  Weapons: uncle,
  Rom mode: NoGlitches,
  Variation: none,
  Difficulty: easy,
  Difficulty mode: Easy,
  Tournament: true,
  Build: 2018-10-18,
  Generated: 2019-02-13T00:00:00+00:00



  ALttP: Randomizer is a new take on the classic game The Legend of Zelda: A Link to the Past. Each playthrough shuffles the location of all the important items in the game. Will you find the Bow atop Death Mountain, the Fire Rod resting silently in the library, or even the Master Sword itself waiting in a chicken coop?

  Challenge your friends to get the fastest time on a particular shuffle or take part in the weekly speedrun competition. Hone your skills enough and maybe you&#x2019;ll take home the crown in our twice-yearly invitational tournament. See you in Hyrule!
  </desc>
  <image>./media/screenshots/A Link To the Past Randomizer.png</image>
  <marquee>./media/marquees/A Link To the Past Randomizer.png</marquee>
  <releasedate>20190213T180000</releasedate>
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
      filename:'Daily Challenge: Feb 13, 2019',
      patch: {
        logic: 30,
        difficulty: 'easy',
        spoiler:
        {
          meta:
          {
            goal: 'ganon',
            mode: 'open',
            name: 'Daily Challenge: Feb 13, 2019',
            build: '2018-10-18',
            logic: 'no-glitches-30',
            weapons: 'uncle',
            rom_mode: 'NoGlitches',
            variation: 'none',
            difficulty: 'easy',
            tournament: true,
            difficulty_mode: 'Easy'
          }
        },
        hash: 'YxMXjeAayz',
        size: 2,
        generated: '2019-02-13T00:00:00+00:00',
      },
      xml
    });
  });

  it('should get the current daily hash', (done) => {
    getCurrentDailyHash('./spec/daily/workspace/daily_hash.json')
        .then((hash) => {
      expect(hash).toBe('YxMXjK2kyz');
      expect(fs.existsSync('./spec/daily/workspace/daily_hash.json'))
          .toBe(true);

      done();
    })
  });

  it('should get the current hash', (done) => {
    getCurrentRomHash('./spec/daily/workspace/current_rom_hash.json')
        .then((hash) => {
      expect(hash).toBe('cb560220b7b1b8202e92381aee19cd36');
      expect(fs.existsSync('./spec/daily/workspace/current_rom_hash.json'))
          .toBe(true);

      done();
    })
  });

  it('should get the current base patch', (done) => {
    getCurrentBasePatch('./spec/daily/workspace/base_patch.json')
        .then((patch) => {
      expect(Object.keys(patch).length).toBeGreaterThan(20);
      expect(fs.existsSync('./spec/daily/workspace/base_patch.json'))
          .toBe(true);

      done();
    })
  });
});

