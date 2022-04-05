const randomizerCLI = require('./index.js');

const url = require('url');
const fs = require('fs');
const path = require('path');
const nock = require('nock');

let scope;

const parentVersion = '033010ffa898555e2c3724c768e687066f259b39';

nock.disableNetConnect();
describe('autoUpdate', () => {
  beforeEach(() => {
    scope = nock('https://api.github.com')
      .get('/repos/loadedsith/alttpr-cli/branches/master')
      .reply(200, (uri, requestBody, cb) => {
        fs.readFile('./spec/github-api/www/master.json', cb);
      });
  });

  it('should exist', () => {
    expect(randomizerCLI.checkForUpdates).not.toBeUndefined();
  });

  it('should get current package', (done) => {
    expect(randomizerCLI.checkForUpdates(parentVersion).then((results) => {
      expect(results.hashPath)
        .toEqual('https://api.github.com:443/repos/loadedsith/alttpr' +
            '-cli/branches/master');
      // Hash comes from the server, it is also the parent sha of th last commit
      expect(results.hash)
        .toEqual('033010ffa898555e2c3724c768e687066f259b39');
      expect(results.parentVersion)
        .toEqual(parentVersion);
      done();
    }));
  });

  it('should not be behind', (done) => {
    expect(randomizerCLI.checkForUpdates(parentVersion).then((results) => {
      // Hash comes from the server, it is also the parent sha of th last commit
      expect(results.behind)
        .toEqual(false);
      done();
    }));
  });

  it('should be behind', (done) => {
    expect(randomizerCLI.checkForUpdates('55378008').then((results) => {
      // Hash comes from the server, it is also the parent sha of th last commit
      expect(results.behind)
        .toEqual(true);
      done();
    }));
  });
});

describe('rom', () => {
  beforeEach(() => {
    scope = nock('https://s3.us-east-2.amazonaws.com')
        .persist()
        .get(/(.*)/)
        .reply(200, (uri, requestBody, cb) => {
          const spriteName =
              path.basename(url.parse(uri).pathname);
          fs.readFile(`./spec/sprites/www/${spriteName}`, cb);
        });
  });
  beforeAll(() => {
    let removeTestFiles = [
      './spec/index/workspace/alttpr - Daily Challenge Apr 5, 2022_4AvprPzgGn.sfc',
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
    });
  });

  it('should load', () => {
    expect(randomizerCLI.ROM).not.toBeUndefined();
  });

  it('should build a rom', (done) => {
    expect(fs.existsSync('./spec/index/workspace/alttpr - Daily Challenge Apr 5, 2022_4AvprPzgGn' +
        '.sfc')).toBe(false);

    randomizerCLI.buildRom('./Zelda no Densetsu - Kamigami no' +
        ' Triforce (Japan).sfc',
      false,
      false,
      'normal',
      'red',
      'normal',
      'Four Swords Link',
      './spec/daily.json',
      './spec/index/workspace/'
    ).then(() => {
      expect(fs.existsSync('./spec/index/workspace/' +
          'alttpr - Daily Challenge Apr 5, 2022_4AvprPzgGn.sfc')).toBe(true);
      done();
    });
  });
});

