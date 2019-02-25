const cp = require('child_process');
const fs = require('fs');
const {getCurrentRomHash, getCurrentBasePatch, getDaily} = require('./updateDaily.js');

const nock = require('nock');

const scope = nock('https://alttpr.com')
  .get('/en/daily')
  .reply(200, (uri, requestBody, cb) => {
    fs.readFile(`./spec/daily/www/daily`, cb); // Error-first callback
  });

nock.disableNetConnect();

describe('Daily update', () => {
  beforeEach(() => {
    let removeTestFiles = [
      './spec/daily/workspace/current_rom_hash.json',
      './spec/daily/workspace/base_patch.json',
    ];
    removeTestFiles.forEach((file) => {
      if (fs.existsSync(file)) {
        fs.unlink(file);
      }
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

