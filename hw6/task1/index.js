'use strict';
const JSON2CSV = require('./json2csv');

const json2csv = new JSON2CSV();

json2csv.readJson('/data/comments.js')
.then(json => json2csv.writeToCsvFile(json, '/data/comments.csv', ',')
  .then(() => console.log('Done'))
)
