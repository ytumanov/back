'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');


class Archiver {
  constructor() {
  }

  packFile(sourcePath, options) {
    const fullPath = path.join(__dirname, sourcePath);
    this._isValidAlgorithm(options);
    this._isFileExist(fullPath);

    const zip = options.algorithm === 'gzip' ? zlib.createGzip() : zlib.createDeflate();
    const read = fs.createReadStream(fullPath);
    const write = fs.createWriteStream(fullPath + '.gz');

    read.pipe(zip).pipe(write)
    .on('finish', () => {
      console.log('File has been packed');
    });
  }

  unpackFile(sourcePath) {
    const fullPath = path.join(__dirname, sourcePath);
    this._isFileExist(fullPath);

    const read = fs.createReadStream(fullPath);
    const unzip = zlib.createUnzip();
    

    const unzipPath = path.join(
      path.dirname(fullPath),
      path.basename(fullPath).slice(0, -3));

    const write = fs.createWriteStream(unzipPath);

    read.pipe(unzip).pipe(write)
    .on('finish', () => {
      console.log('File has been unpacked');
    });
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
