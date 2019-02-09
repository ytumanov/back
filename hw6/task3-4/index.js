'use strict';
const Archiver = require('./archiver');

const archiver = new Archiver();

archiver.packFile('/data/comments.js', { algorithm: 'deflate'});

//unpack is the same for gzip and deflate
archiver.unpackFile('/data/comments1.js.gz');
