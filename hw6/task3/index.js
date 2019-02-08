'use strict';
const JSON2CSV = require('./json2csv');

const json2csv = new JSON2CSV();
const allowedColumns = ['postId', 'name', 'body'];

json2csv.readJson('/data/comments.js')
.then(json => json2csv.writeToCsvFile(json, '/data/comments.csv', ',', allowedColumns)
  .then(() => console.log('Done'))
)

//todo add archiver
