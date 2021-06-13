'use strict';

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('tabelle.db', (err) => {
  if (err) throw err;
});

module.exports = db;