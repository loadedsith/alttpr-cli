const SparkMD5 = require('spark-md5');
const FileSaver = require('file-saver');
const fs = require('fs');


var ROM = (function(arrayBuffer, loaded_callback, error_callback) {
  var u_array = [];
  var base_patch;
  var original_data;
  var size = 2; // mb

  // arrayBuffer = this.result;

  // if (typeof arrayBuffer === 'undefined') {
  //   if (error_callback) error_callback();
  //   return;
  // }
  // Check rom for header and cut it out

  this.checkMD5 = function() {
    return SparkMD5.ArrayBuffer.hash(arrayBuffer);
  };

  this.getArrayBuffer = function() {
    return arrayBuffer;
  };

  this.getOriginalArrayBuffer = function() {
    return original_data;
  };

  this.write = function(seek, bytes) {
    if (!Array.isArray(bytes)) {
      u_array[seek] = bytes;
      return;
    }
    for (var i = 0; i < bytes.length; i++) {
      u_array[seek + i] = bytes[i];
    }
  };

  this.updateChecksum = function() {
    return new Promise(function(resolve, reject) {
      var sum = u_array.reduce(function(sum, mbyte, i) {
        if (i >= 0x7FDC && i < 0x7FE0) {
          return sum;
        }
        return sum + mbyte;
      });
      var checksum = (sum + 0x1FE) & 0xFFFF;
      var inverse = checksum ^ 0xFFFF;
      this.write(0x7FDC, [inverse & 0xFF, inverse >> 8, checksum & 0xFF, checksum >> 8]);
      resolve(this);
    }.bind(this));
  }.bind(this);

  this.save = function(filename) {
    this.updateChecksum().then(function() {
      fs.writeFileSync(filename, Buffer.from( new Uint8Array(u_array) ))
    });
  };

  this.parseSprGfx = function(spr) {
    if ('ZSPR' == String.fromCharCode(spr[0]) + String.fromCharCode(spr[1]) + String.fromCharCode(spr[2]) + String.fromCharCode(spr[3])) {
      return this.parseZsprGfx(spr);
    }
    return new Promise(function(resolve, reject) {
      for (var i = 0; i < 0x7000; i++) {
        u_array[0x80000 + i] = spr[i];
      }
      for (var i = 0; i < 120; i++) {
        u_array[0xDD308 + i] = spr[0x7000 + i];
      }
      // gloves color
      u_array[0xDEDF5] = spr[0x7036];
      u_array[0xDEDF6] = spr[0x7037];
      u_array[0xDEDF7] = spr[0x7054];
      u_array[0xDEDF8] = spr[0x7055];
      resolve(this);
    }.bind(this));
  }.bind(this);

  this.parseZsprGfx = function(zspr) {
    // we are going to just hope that it's in the proper format O.o
    return new Promise(function(resolve, reject) {
      var gfx_offset =  zspr[12] << 24 | zspr[11] << 16 | zspr[10] << 8 | zspr[9];
      var palette_offset = zspr[18] << 24 | zspr[17] << 16 | zspr[16] << 8 | zspr[15];
      // GFX
      for (var i = 0; i < 0x7000; i++) {
        u_array[0x80000 + i] = zspr[gfx_offset + i];
      }
      // Palettes
      for (var i = 0; i < 120; i++) {
        u_array[0xDD308 + i] = zspr[palette_offset + i];
      }
      // Gloves
      for (var i = 0; i < 4; ++i) {
        u_array[0xDEDF5 + i] = zspr[palette_offset + 120 + i];
      }
      resolve(this);
    }.bind(this));
  }.bind(this);

  this.setQuickswap = function(enable) {
    return new Promise(function(resolve, reject) {
      this.write(0x18004B, enable ? 0x01 : 0x00);
      resolve(this);
    }.bind(this));
  }.bind(this);

  this.setMusicVolume = function(enable) {
    return new Promise(function(resolve, reject) {
      this.write(0x0CFE18, !enable ? 0x00 : 0x70);
      this.write(0x0CFEC1, !enable ? 0x00 : 0xC0);
      this.write(0x0D0000, !enable ? [0x00, 0x00] : [0xDA, 0x58]);
      this.write(0x0D00E7, !enable ? [0xC4, 0x58] : [0xDA, 0x58]);
      resolve(this);
    }.bind(this));
  }.bind(this);

  this.setMenuSpeed = function(speed) {
    return new Promise(function(resolve, reject) {
      var fast = false;
      switch (speed) {
        case 'instant':
        this.write(0x180048, 0xE8);
          fast = true;
          break;
        case 'fast':
        this.write(0x180048, 0x10);
          break;
        case 'normal':
        default:
        this.write(0x180048, 0x08);
          break;
        case 'slow':
        this.write(0x180048, 0x04);
          break;
      }
      this.write(0x6DD9A, fast ? 0x20 : 0x11);
      this.write(0x6DF2A, fast ? 0x20 : 0x12);
      this.write(0x6E0E9, fast ? 0x20 : 0x12);
      resolve(this);
    }.bind(this));
  }.bind(this);

  this.setHeartColor = function(color_on) {
    return new Promise(function(resolve, reject) {
      switch (color_on) {
        case 'blue':
          byte = 0x2C;
          file_byte = 0x0D;
          break;
        case 'green':
          byte = 0x3C;
          file_byte = 0x19;
          break;
        case 'yellow':
          byte = 0x28;
          file_byte = 0x09;
          break;
        case 'red':
        default:
          byte = 0x24;
          file_byte = 0x05;
      }
      this.write(0x6FA1E, byte);
      this.write(0x6FA20, byte);
      this.write(0x6FA22, byte);
      this.write(0x6FA24, byte);
      this.write(0x6FA26, byte);
      this.write(0x6FA28, byte);
      this.write(0x6FA2A, byte);
      this.write(0x6FA2C, byte);
      this.write(0x6FA2E, byte);
      this.write(0x6FA30, byte);
      this.write(0x65561, file_byte);
      resolve(this);
    }.bind(this));
  }.bind(this);

  this.setHeartSpeed = function(speed) {
    return new Promise(function(resolve, reject) {
      var sbyte = 0x20;
      switch (speed) {
        case 'off': sbyte = 0x00; break;
        case 'half': sbyte = 0x40; break;
        case 'quarter': sbyte = 0x80; break;
        case 'double': sbyte = 0x10; break;
      }
      this.write(0x180033, sbyte);
      resolve(this);
    }.bind(this));
  }.bind(this);

  this.parsePatch = function(data, progressCallback) {
    return new Promise(function(resolve, reject) {
      this.difficulty = data.difficulty;
      this.seed = data.seed;
      this.spoiler = data.spoiler;
      this.hash = data.hash;
      this.generated = data.generated;
      if (data.size) {
        this.resize(data.size);
      }
      if (data.spoiler && data.spoiler.meta) {
        this.build = data.spoiler.meta.build;
        this.goal = data.spoiler.meta.goal;
        this.logic = data.spoiler.meta.logic;
        this.mode = data.spoiler.meta.mode;
        this.name = data.spoiler.meta.name;
        this.variation = data.spoiler.meta.variation;
        this.weapons = data.spoiler.meta.weapons;
        this.shuffle = data.spoiler.meta.shuffle;
        this.difficulty_mode = data.spoiler.meta.difficulty_mode;
        this.notes = data.spoiler.meta.notes;
        this.tournament = data.spoiler.meta.tournament;
        this.special = data.spoiler.meta.special;
      }
      if (data.patch && data.patch.length) {
        data.patch.forEach(function(value, index, array) {
          if (progressCallback) progressCallback(index / data.patch.length, this);
          for (address in value) {
            this.write(Number(address), value[address]);
          }
        }.bind(this));
      }
      resolve(this);
    }.bind(this));
  };

  this.setBasePatch = function(patch) {
    this.base_patch = patch;
  };

  this.resizeUint8 = function(baseArrayBuffer, newByteSize) {
    var resizedArrayBuffer = new ArrayBuffer(newByteSize),
      len = baseArrayBuffer.byteLength,
      resizeLen = (len > newByteSize)? newByteSize : len;

    (new Uint8Array(resizedArrayBuffer, 0, resizeLen)).set(new Uint8Array(baseArrayBuffer, 0, resizeLen));

    return resizedArrayBuffer;
  };

  this.resize = function(size) {
    switch (size) {
      case 4:
        arrayBuffer = this.resizeUint8(arrayBuffer, 4194304);
        break;
      case 2:
        arrayBuffer = this.resizeUint8(arrayBuffer, 2097152);
        break;
      case 1:
      default:
        size = 1;
        arrayBuffer = this.resizeUint8(arrayBuffer, 1048576);
    }
    u_array = new Uint8Array(arrayBuffer);
    this.size = size;
  };

  this.downloadFilename = function() {
    return this.name
      || 'ALttP - VT_' + this.logic
      + '_' + this.difficulty
      + '-' + this.mode
      + (this.weapons ? '_' + this.weapons : '')
      + '-' + this.goal
      + (this.variation == 'none' ? '' : '_' + this.variation)
      + '_' + this.hash
      + (this.special ? '_special' : '');
  };

  this.reset = function() {
    return new Promise((resolve, reject) => {
      arrayBuffer = original_data.slice(0);
      // always reset to 2mb so we can verify MD5 later
      this.resize(2);

      if (!this.base_patch) {
        reject('base patch not set');
      }
      this.parsePatch({patch: this.base_patch}).then((rom) => {
        resolve(rom);
      }).catch((error) => {
        console.log(error, ":(");
        reject('sadness');
      });
    });
  };

  if (arrayBuffer.byteLength % 0x400 == 0x200) {
    arrayBuffer = arrayBuffer.slice(0x200, arrayBuffer.byteLength);
  }

  original_data = arrayBuffer.slice(0);

  this.resize(size);

  u_array = new Uint8Array(arrayBuffer);

  if (loaded_callback) loaded_callback(this);
});

module.exports = ROM;



// WEBPACK FOOTER //
// ./resources/assets/js/rom.js
