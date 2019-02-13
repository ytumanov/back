'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');


class Archiver {
  constructor() {
  }

  packFile(sourcePath, socket) {
    const fullPath = path.join(__dirname, sourcePath);
    this._isFileExist(fullPath);

    const zip = zlib.createGzip();
    const read = fs.createReadStream(fullPath);

    return read.pipe(zip).pipe(socket);
  }

  unpackFile(sourcePath, socket) {
    const fullPath = path.join(__dirname, sourcePath);
    this._isFileExist(fullPath);

    const read = fs.createReadStream(fullPath);
    const unzip = zlib.createUnzip();

    return read.pipe(unzip).pipe(socket);
  }

  _isFileExist(path) {
    if (!fs.existsSync(path)) { 
       throw new Error(`File ${path} is not exist`);
    } 
  }

  _isValidAlgorithm(options) {
    if (typeof(options.algorithm) !== 'string') {
      throw new Error(`Only string type algorithm allowed`);
    }

    if (Object.keys(options).length !== 1) {
      throw new Error(`More than one option provided`);
    }

    if (options.algorithm !== 'gzip' && options.algorithm !== 'deflate') {
      throw new Error(`Not allowed pack algorithm ${options.algorithm} provided`);
    }
  }

}

module.exports = Archiver;
