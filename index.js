'use strict';

let express = require('express');
let path = require('path');

let wedding = require('./wedding/index.js');

let app = express();
let port = 8000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use('/wedding', wedding);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
