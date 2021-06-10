'use strict';

const express = require('express');
const dao = require('./dao');
const morgan = require('morgan');
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
// init express
const app = new express();
const port = 3001;


// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());






app.get('/api/questions/:id', async (req, res) => {
  try {
      const result = await dao.getQuestions(req.params.id);
      if (result.error)
          res.status(404).json(result);
      else
          res.json(result);
  } catch (err) {
      res.status(503).json({error: `Database error during query execution.`});
  }
});



// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});