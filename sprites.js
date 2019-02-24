const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

const spritesJSON = require('./sprites/sprites.json');



const spriteNames = spritesJSON.reduce((acc, sprite) => {
  acc.push(sprite.name);
  return acc;
}, []);

const getSpriteUrl = (spriteName) => {
  return spritesJSON.find((sprite) => {
    return sprite.name === spriteName;
  }).file;
}

const getSpriteFileName = (spriteName) => {
  return path.basename(url.parse(getSpriteUrl(spriteName)).pathname)
}

const downloadSprite = (spriteName, outDir = './sprites/', http_ = http) => {
  const filename = getSpriteFileName(spriteName);
  const spriteUrl = getSpriteUrl(spriteName);
  const file = fs.createWriteStream(`./${outDir}/${filename}`);

  return http_.get(spriteUrl, function(response) {
    response.pipe(file);
  });
};

module.exports = {
  spriteNames,
  downloadSprite,
  getSpriteFileName,
  getSpriteUrl,
};
