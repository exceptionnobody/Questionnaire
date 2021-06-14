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


app.get("/api/info", async (req, res)=>{

})

// Parametrica /api/questionari?admin=?
app.get('/api/questionari', async (req, res) => {

  try {
    
    let result
    const idAdmin = {
      admin: req.query.admin
    }

    if(idAdmin.admin.toString()!== "null")
      result = await dao.getAllMyQuestionnaire(idAdmin.admin);
    else
      result = await dao.getAllQuestionnaire();

    if (result.error)
        res.status(404).json(result);
    else
        res.json(result);
} catch (err) {
    res.status(503).json({error: `Database error during query execution.`});
}

})

// Query parametrica /api/domande?qid=valore
app.get('/api/domande', async (req, res) => {


  try {
    let result;

    const idQuest = req.query.admin
    

    if(idQuest.toString() !== "null")
      result = await dao.getDomande(parseInt(idQuest));
    else
      result = await dao.getTutteDomande()
     
    if (result.error)
          res.status(404).json(result);
      else
          res.json(result);
  } catch (err) {
      res.status(503).json({error: `Database error during query execution.`});
  }
});

app.get('/api/answer/:id', async (req, res) => {
  try {
      const result = await dao.getOptions(req.params.id);
      if (result.error)
          res.status(404).json(result);
      else
          res.json(result);
  } catch (err) {
      res.status(503).json({error: `Database error during query execution.`});
  }
});

app.post('/api/questionari', async (req, res) => {
 
  const questionario = {
    qid: req.body.qid,
    admin: req.body.admin,
    titolo: req.body.titolo,
    numdomande: req.body.numdomande
  };

 // console.log(domande)
 console.log(questionario)
 
 dao.createQuestionario(questionario).then((qid)=>{
   console.log("inserimento andato a buon fine "+ qid)
   res.status(201).json(qid).end()
 }).catch((err)=>{  res.status(503).json({ errors: [{'param': 'Server', 'msg': err}]}) })

 })

 app.post('/api/domandeaperte', async (req, res) => {
 
 const domanda = {

  did: req.body.did,
  qid: req.body.qid,
  quesito: req.body.quesito,
  min: req.body.min,
  max: req.body.max,
  tipo: req.body.tipo,
  numopzioni: req.body.numopzioni
  
}
console.log(domanda)

 dao.inserisciDomandeAperta(domanda).then((did)=>{

    res.status(201).json(did).end();
 }).catch((err)=>{  res.status(503).json({ errors: [{'param': 'Server', 'msg': err}]}) })

 })


 app.post('/api/domandechiuse', async (req, res) => {
 
  const domanda = {
 
   did: req.body.did,
   qid: req.body.qid,
   quesito: req.body.quesito,
   min: req.body.min,
   max: req.body.max,
   tipo: req.body.tipo,
   numopzioni: req.body.numopzioni,
   ...req.body
   
 }
 console.log(domanda)
 
  dao.inserisciDomandeChiusa(domanda).then((did)=>{
    console.log("inserimento andato a buon fine "+ did)
    res.status(201).json(did).end();
  }).catch((err)=>{  res.status(503).json({ errors: [{'param': 'Server', 'msg': err}]}) })
 
  })
 


app.delete("/api/questionari", async (req, res) => {
  
  await dao.cancellaQuestionari().then(() => {res.status(200).end()})
  .catch((err) => { res.status(503).json({ errors: [{'param': 'Server', 'msg': err}]})})
})

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});