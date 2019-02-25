const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
let spritesJSON;

try {
  spritesJSON = require('./sprites/sprites.json');
} catch (e) {
  console.log('Sprites.json could not be found, try running "npm run' +
   'update-sprites"');
  throw e;
}

const spriteNames = spritesJSON.reduce((acc, sprite) => {
  acc.push(sprite.name);
  return acc;
}, []);

const getSpriteUrl = (spriteName) => {
  try {
    return spritesJSON.find((sprite) => {
      return sprite.name === spriteName;
    }).file;
  } catch (e) {
    if (e.message.indexOf('read property \'file\' of undefined') > -1) {
      throw new Error('No sprite found in the sprite.json. Did you try' +
          ' `npm run update-sprites`?');
    }
    throw e
  }
};

const getSpriteFileName = (spriteName) => {
  return path.basename(url.parse(getSpriteUrl(spriteName)).pathname);
};

const downloadSprite = (spriteName, outDir = 'sprites', http_ = http) => {
  return new Promise((resolve, reject) => {
    const spriteUrl = getSpriteUrl(spriteName);

    http_.get(spriteUrl, (response) => {
      console.log({[spriteName]:response.statusCode});
      if (response.statusCode == 200 && response.statusCode < 299) {
        const filename = getSpriteFileName(spriteName);
        const file = fs.createWriteStream(`./${outDir}/${filename}`);
        let stream = response.pipe(file);

        stream.on('finish', function() {
          file.close();
          resolve();
        });
      } else {
        reject(`Failed to download ${spriteName}: ${spriteUrl}. ${JSON.stringify(response)}`);
      }

    });
  });
};

const getSprite = (spriteName) => {
  return new Promise((resolve, reject) => {
    const filename = getSpriteFileName(spriteName);

    try {
      let sprite = fs.readFileSync(`./sprites/${filename}`);
      resolve(sprite);
    } catch (e) {
      downloadSprite(spriteName).then(() => {
        sprite = fs.readFileSync(`./sprites/${filename}`);
        resolve(sprite);
      }).catch((e) => {
        console.log('getSprite Download failed. ', e);
        reject(e)
        throw e
      });
    }
  });
};

module.exports = {
  spriteNames,
  downloadSprite,
  getSpriteFileName,
  getSpriteUrl,
  getSprite,
};
