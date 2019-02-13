'use strict';

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);


class JSON2CSV {
  constructor() {
  }

  async readJson(sourcePath) {
    const file = await readFile(path.join(__dirname, sourcePath), { encoding: 'utf8'});
    return JSON.parse(file);
  }

  async writeToCsvFile(json, destinationPath, separator) {
    if (separator !== ',' && separator !== ';') {
        throw new Error(`Not valid separator ${separator} provided`);
    }

    const data = this._prepareCsv(json, separator);
    //console.log(data);
    await writeFile(path.join(__dirname, destinationPath), data);
  }

  _prepareCsv(json, separator) {
    const columns = this._getColumns(json);

    const rowsWithColumns = this._getRows(json, columns);
    rowsWithColumns.unshift(columns);

    return rowsWithColumns.map(elem => elem.join(separator).replace(/\n/g, " ")).join('\n');
  }

  _getColumns(json) {
    let columns = [];

    json.forEach(element => {
      for (let key in element) {
        if (element.hasOwnProperty(key) && !columns.includes(key)) {
          columns.push(key);
        }
      }
    });

    return columns;
  }

  _getRows(json, columns) {
    let rows = [];
    json.forEach(element => {
      let row = [];
      for (let i = 0; i < columns.length; i++) {
        if (typeof element[columns[i]] === 'object') {
          row.push(JSON.stringify(element[columns[i]]));
        } else {
          row.push(element[columns[i]]);
        }
      }
      rows.push(row);
    });
    return rows;
  }
}

module.exports = JSON2CSV;
