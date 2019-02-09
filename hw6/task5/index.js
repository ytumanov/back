'use strict';

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const appendFile = promisify(fs.appendFile);

const filesDir = path.join(__dirname, 'files');
const currentFiles = fs.readdirSync(filesDir);

fs.watch(filesDir, (eventType, filename) => {
  if (!filename.includes('.js')) {
    return;
  }

  if (eventType === 'rename') {
    const index = currentFiles.indexOf(filename);

    if (index >= 0) {
        currentFiles.splice(index, 1);
        rebuild();
        return;
    }

    readFile(path.join(filesDir, filename), 'utf8')
    .then(data => appendFile(path.join(__dirname, '/build/bundle.js'), data)
      .then(() => console.log('bundle.js has been updated')));

    currentFiles.push(filename);
    return;
  }

  if (eventType === 'change') {
    rebuild();
  }
});

const rebuild = function () {
  const bundlePath = path.join(__dirname, '/build/bundle.js');

  if (fs.existsSync(bundlePath)) { 
    fs.unlinkSync(bundlePath);
  }

  //could be problems when we deleting several files from folder
  currentFiles.forEach(filename => {
    readFile(path.join(filesDir, filename), 'utf8')
    .then(data => appendFile(bundlePath, data))
  });
  console.log('bundle.js has been rewritten');
}

setInterval(() => {
  console.log(currentFiles);
}, 2000);