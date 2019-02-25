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
  return spritesJSON.find((sprite) => {
    return sprite.name === spriteName;
  }).file;
};

const getSpriteFileName = (spriteName) => {
  return path.basename(url.parse(getSpriteUrl(spriteName)).pathname);
};

const downloadSprite = (spriteName, outDir = 'sprites', http_ = http) => {
  return new Promise((resolve, reject) => {
    const filename = getSpriteFileName(spriteName);
    const spriteUrl = getSpriteUrl(spriteName);
    const file = fs.createWriteStream(`./${outDir}/${filename}`);

    http_.get(spriteUrl, (response) => {
      let stream = response.pipe(file);
      stream.on('finish', function () {
        file.close()
        resolve();
       });

    }, reject);
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
