const net = require('net');

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
        //archive: true
    }

    client.write(JSON.stringify({ filter, meta }));
});

client.on('data', data => {
    console.log(data.toString());
});

client.on('close', () => {
    console.log('Connection closed!');
});