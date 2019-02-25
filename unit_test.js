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

nock.disableNetConnect();
describe('rom', () => {
  it('should load', () => {
    expect(randomizerCLI.ROM).not.toBeUndefined();
  });

  it('should build a rom', (done) => {
    randomizerCLI.buildRom('./Zelda no Densetsu - Kamigami no' +
        ' Triforce (Japan).sfc').then(done);
  });
});

