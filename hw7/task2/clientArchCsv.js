const net = require('net');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const writeFile = promisify(fs.writeFile);

const client = new net.Socket();
client.connect(8080, () => {
    console.log('Connected!');
    const filter = {
      email: 'gmail',
      name: {
              last: 'am'
          },
      address: {
              zip: '3'
          }
    }

    const meta = {
        format: 'csv',
        archive: true
    }

    client.write(JSON.stringify({ filter, meta }));
});

client.on('data', data => {
    (async () => {
        await writeFile(path.join(__dirname, '/receivedData/received.csv.gz'), data);
      })();
});

client.on('close', () => {
    console.log('File received');
});