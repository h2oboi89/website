'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const http = require('http');
const https = require('https');
const favicon = require('serve-favicon');

const privateKey = fs.readFileSync('/etc/letsencrypt/live/2h2o.us/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/2h2o.us/fullchain.pem', 'utf8');

const wedding = require('./wedding/index.js');

const credentials = {
  key: privateKey,
  cert: certificate
};

const app = express();
const httpPort = 8000;
const httpsPort = 443;

app.use(favicon(path.join(__dirname + 'wave_icon.ico')));

app.get('/', (req, res) => {
  res.redirect('/wedding');
});

app.use('/wedding', wedding);

let httpsServer = https.createServer(credentials, app);

httpsServer.listen(httpsPort, '0.0.0.0', (error) => {
  if(error) {
    console.log(error);
    process.exit(1);
  }

  try {
    console.log('Old User ID: ' + process.getuid() + ', Old Group ID: ' + process.getgid());
    process.setgid('users');
    process.setuid('waters');
    console.log('New User ID: ' + process.getuid() + ', New Group ID: ' + process.getgid());
  }
  catch(err) {
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
