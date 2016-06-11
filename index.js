'use strict';

let fs = require('fs');
let path = require('path');
let express = require('express');
let http = require('http');
let https = require('https');
let privateKey = fs.readFileSync('/etc/letsencrypt/live/2h2o.us/privkey.pem', 'utf8');
let certificate = fs.readFileSync('/etc/letsencrypt/live/2h2o.us/fullchain.pem', 'utf8');

let wedding = require('./wedding/index.js');

let credentials = {
  key: privateKey,
  cert: certificate
};
let app = express();
let httpPort = 8000;
let httpsPort = 443;

app.get('/', (req, res) => {
  // res.sendFile(path.join(__dirname, 'index.html'));
  res.redirect('/wedding');
});

app.use('/wedding', wedding);

let httpsServer = https.createServer(credentials, app);

httpsServer.listen(httpsPort, '0.0.0.0', (error) => {
  if (error) {
    console.log(error);
    process.exit(1);
  }

  try {
    console.log('Old User ID: ' + process.getuid() + ', Old Group ID: ' + process.getgid());
    process.setgid('users');
    process.setuid('waters');
    console.log('New User ID: ' + process.getuid() + ', New Group ID: ' + process.getgid());
  } catch (err) {
    console.log('Cowardly refusing to keep the process alive as root.');
    process.exit(1);
  }
  console.log(`HTTPS Server listening on port ${httpsPort}!`);
});

http.createServer((req, res) => {
    res.writeHead(301, {
      "Location": "https://" + req.headers['host'] + req.url
    });
    res.end();
  })
  .listen(httpPort, () => {
    console.log(`HTTP Server listening on port ${httpPort}!`);
  });
