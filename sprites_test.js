const {
  spriteNames,
  downloadSprite,
  getSpriteFileName,
  getSpriteUrl,
} = require('./sprites.js');

const path = require('path');
const url = require('url');
const fs = require('fs');
const nock = require('nock');
const scope = nock('https://s3.us-east-2.amazonaws.com')
  .get(/(.*)/)
  .reply(200, (uri, requestBody, cb) => {
    const spriteName =
        path.basename(url.parse(uri).pathname);
    fs.readFile(`./spec/sprites/www/${spriteName}`, cb); // Error-first callback
  });

nock.disableNetConnect();


describe('Sprites', () => {
  beforeEach(() => {

  });

  it('should list sprite names', () => {
    expect(spriteNames).toEqual([
      'Link', 'Four Swords Link', 'Arrghus', 'Beau', 'Bewp', 'Big Key',
      'Blacksmith Link', 'Bob', 'Boo 2', 'Boo', 'Broccoli', 'Bronzor',
      'B.S. Boy', 'B.S. Girl', 'Cactuar', 'Casual Zelda', 'Marvin the Cat',
      'Cat Boo', 'CD-i Link', 'Celes', 'Cheep Cheep', 'Cirno', 'Clifford',
      'Conker', 'Cursor', 'Dark Boy', 'Dark Girl', 'Dark Link (Tunic)',
      'Dark Link', 'Dark Swatchy', 'Dark Zelda', 'Dark Zora', 'Deadrock',
      'Decidueye', 'Demon Link', 'Dragonite', 'Eggplant', 'EmoSaru',
      'Fox Link', 'Frog Link', 'Ganondorf', 'Garfield', 'Goomba',
      'GrandPOOBear', 'Gruncle Stan', 'Headless Link', 'Hoarder (Bush)',
      'Hoarder (Pot)', 'Hoarder (Rock)', 'Homer Simpson', 'Hyrule Knight',
      'Ignignokt', 'Inkling', 'Invisible Link', 'Jogurt', 'Kecleon',
      'Kholdstare', 'Kirby', 'Kore8', 'Lakitu', 'Hat Color Link',
      'Tunic Color Link', 'Pony', 'Luigi', 'Magus', 'Maiden', 'Manga Link',
      'Maple Queen', 'Mario (Classic)', 'Mario and Cappy', 'Marisa Kirisame',
      'Meatwad', 'Megaman X', 'Mike Jones', 'Minish Cap Link', 'missingno',
      'Modern Link', 'Mog', 'Mouse', 'Power Up with Pride Mushroom',
      'Nature Link', 'Navi', 'Negative Link', ' NES Link', 'Ness (Earthbound)',
      'Old Man', 'Ori', 'Outline Link', 'Parallel Worlds Link', 'Penguin Link',
      'Phoenix Wright', 'Pikachu', 'Pink Ribbon Link', 'Plague Knight',
      'Pokey', 'Popoi', 'Pride Link', 'Psyduck', 'The Pug', 'Purple Chest',
      'Rainbow Link', 'Robo-Link 9000', 'Roy Koopa', 'Rumia', 'Ryu',
      'Sailor Moon', 'Samus', 'Santa Link', 'Scholar', 'Shadow Sakura',
      'Shantae', 'Shuppet', 'Shy Guy', 'SNES Controller', 'Soda Can',
      'Hyrule Soldier', 'Sonic the Hedgehog', 'Sora', 'Squirtle',
      'Static Link', 'Super Bunny', 'Super Meat Boy', 'Swatchy', 'Tea Time',
      'Terra (Esper)', 'Thief', 'Tile', 'Tingle', 'TMNT', 'Toad', 'Toadette',
      'TotemLinks', 'Trogdor the Burninator', 'TP Zelda', 'Ultros', 'Valeera',
      'VanillaLink', 'Vitreous', 'Vivi', 'Vivian', 'Will', 'wixB', 'Wizzrobe',
      'Yunica Tovah', 'Zandra', 'Zelda', 'Zero Suit Samus', 'Zora',
    ]);
  });

  it('should get a sprite url based on a sprite name', () => {
    expect(getSpriteUrl('Link')).toEqual(
        'https:\/\/s3.us-east-2.amazonaws.com\/alttpr\/001.link.1.zspr');
  });

  it('should get a sprite filename based on a sprite name', () => {
    expect(getSpriteFileName('Link')).toEqual('001.link.1.zspr');
  });

  it('should download a sprite', (done) => {
    downloadSprite(spriteNames[0], 'spec/sprites/workspace').then(() => {
      done();
    });
  });

  it('should fail to download a sprite; missing sprite', (done) => {
      downloadSprite('notARealSprite', 'spec/sprites/workspace').then(() => {
        expect('This code should be unreachable').toEqual(false);
        done()
      }).catch((e) => {
        expect(e.message).toEqual('No sprite found in the sprite.json. Did you try' +
          ' `npm run update-sprites`?');
        done()
      });
  });

  it('should fail to download a sprite; real sprite, missing download', (done) => {
      downloadSprite('Bewp', 'spec/sprites/workspace').then(() => {
        expect('This code should be unreachable').toEqual(false);
        done()
      }).catch((e) => {
          expect(e.slice(0,79)).toEqual('Failed to download Bewp:' +
            ' https://s3.us-east-2.amazonaws.com/alttpr/bewp.1.zspr.'
          );
          expect(fs.existsSync('./spec/sprites/workspace/Bewp.1.zspr'))
              .toBe(false);
          done();
        });
      });
});

