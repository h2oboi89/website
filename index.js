'use strict';

let fs = require('fs');
let path = require('path');
let express = require('express');
let http = require('http');
let https = require('https');
let privateKey = fs.readFileSync('/etc/letsencrypt/live/2h2o.us/privkey.pem', 'utf8');
let certificate = fs.readFileSync('/etc/letsencrypt/live/2h2o.us/cert.pem', 'utf8');

let wedding = require('./wedding/index.js');

let credentials = {
  key: privateKey,
  cert: certificate
};
let app = express();
let port = 8443;

app.get('/', (req, res) => {
  // res.sendFile(path.join(__dirname, 'index.html'));
  res.redirect('/wedding');
});

app.use('/wedding', wedding);

let httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, '0.0.0.0', (error) => {
  if(error) {
    console.log(error);
    return;
  }

  // Find out which user used sudo through the environment variable
  let uid = parseInt(process.env.SUDO_UID);

  // Set our server's uid to that user
  if(uid) {
    process.setuid(uid);
  }
  console.log('Server\'s UID is now ' + process.getuid());
  console.log(`Example app listening on port ${port}!`);
});

http.createServer((req, res) => {
    res.writeHead(301, {
      "Location": "https://" + req.headers['host'] + req.url
    });
    res.end();
  })
  .listen(8000);
