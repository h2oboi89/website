'use strict';

const express = require('express');
const path = require('path');

const app = express();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/AuGresMap.PNG', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
})

module.exports = app;
