const https = require('https');
const fs = require('fs');
const url = require('url');
const path = require('path');
let spritesJSON;

try {
  spritesJSON = require(process.cwd() + '/sprites/sprites.json');
} catch (e) {
  console.log('Sprites.json could not be found, try running "npm run ' +
   'update-sprites"');
  throw e;
}

const spriteNames = spritesJSON.reduce((acc, sprite) => {
  acc.push(sprite.name);
  return acc;
}, []);

const getSpriteUrl = (spriteName) => {
  try {
    let file = spritesJSON.find((sprite) => {
      return sprite.name === spriteName;
    });
    if (file) {
      return file.file;
    } else {
      throw new Error('No sprite found in the sprite.json. Did you try `npm run update-sprites`?')
    }
  } catch (e) {
    // Todo: this error is node version specific and needs to be handled in a different way.
    if (e.message.indexOf('read properties of undefined (reading \'file\')') > -1) {
      throw new Error('No sprite found in the sprite.json. Did you try' +
          ' `npm run update-sprites`?');
    } else {
          throw e
    }
  }
};

const getSpriteFileName = (spriteName) => {
  return path.basename(url.parse(getSpriteUrl(spriteName)).pathname);
};

const downloadSprite = (spriteName, outDir = 'sprites', https_ = https) => {
  return new Promise((resolve, reject) => {
    const spriteUrl = getSpriteUrl(spriteName);

    if (!fs.existsSync(outDir)){
        fs.mkdirSync(outDir, { recursive: true });
    }
    
    https_.get(spriteUrl, (response) => {
      if (response.statusCode == 200 && response.statusCode < 299) {
        const filename = getSpriteFileName(spriteName);
        const file = fs.createWriteStream(`./${outDir}/${filename}`);
        let stream = response.pipe(file);
        stream.on('finish', function() {
          file.close();
          resolve();
        });
      } else {
        reject(new Error(`Failed to download ${spriteName}: [${spriteUrl}]. ${JSON.stringify(response)}`));
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
