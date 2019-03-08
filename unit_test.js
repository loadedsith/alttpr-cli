const cp = require('child_process');
const randomizerCLI = require('./index.js');

const url = require('url');
const fs = require('fs');
const path = require('path');
const nock = require('nock');

const scope = nock('https://s3.us-east-2.amazonaws.com')
  .get(/(.*)/)
  .reply(200, (uri, requestBody, cb) => {
    const spriteName =
        path.basename(url.parse(uri).pathname);
    fs.readFile(`./spec/sprites/www/${spriteName}`, cb); // Error-first callback
  });

const scopeGithub = nock('https://api.github.com')
  .get('/repos/loadedsith/alttpr-cli/branches/master')
  .reply(200, (uri, requestBody, cb) => {
    fs.readFile(`./spec/github-api/www/master.json`, cb);
  });


nock.disableNetConnect();
describe('autoUpdate', () => {
  it('should exist', () => {
    expect(randomizerCLI.checkForUpdates).not.toBeUndefined();
  });

  it('should get current package', (done) => {
    expect(randomizerCLI.checkForUpdates().then((results) => {
      expect(results.repository).toEqual('github:loadedsith/alttpr-cli');
      expect(results.hashPath)
        .toEqual('https://api.github.com/repos/loadedsith/alttpr' +
            '-cli/branches/master');
      expect(results.hash)
        .toEqual('c00beb6313845885ee66d5f46c6a2dea80a6fba2');
      done();
    }))
  });
});

describe('rom', () => {
  beforeAll(() => {
    let removeTestFiles = [
      './spec/index/workspace/Daily Challenge: Feb 13, 2019.sfc',
    ];
    removeTestFiles.forEach((file) => {
      if (fs.existsSync(file)) {
        fs.unlink(file);
      }
    })
  });
  it('should load', () => {
    expect(randomizerCLI.ROM).not.toBeUndefined();
  });

  it('should build a rom', (done) => {
    expect(fs.existsSync('./spec/index/workspace/Daily Challenge: Feb 13, 2019.sfc')).toBe(false);

    randomizerCLI.buildRom('./Zelda no Densetsu - Kamigami no' +
        ' Triforce (Japan).sfc',
      false,
      false,
      'normal',
      'red',
      'normal',
      'Link',
      './spec/daily.json',
      './spec/index/workspace/'
    ).then(() => {
      expect(fs.existsSync('./spec/index/workspace/Daily Challenge: Feb 13, 2019.sfc')).toBe(true);
      done();
    });
  });
});

