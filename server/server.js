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





app.get('/api/questionari', async (req, res) => {

  try {
    const result = await dao.getAllQuestionari();
    if (result.error)
        res.status(404).json(result);
    else
        res.json(result);
} catch (err) {
    res.status(503).json({error: `Database error during query execution.`});
}

})


app.get('/api/domande/:id', async (req, res) => {
  try {
      const result = await dao.getDomande(req.params.id);
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

  const domande =  req.body.domande

 // console.log(domande)
  console.log(questionario)
  
  dao.createQuestionario(questionario).then( (id)=>{
    /*
      let vett=[...domande]
      for(const v of vett){ 
            if(v[tipo] === 1){
              for(const j of v.opzioni){
                const sdf = `opzione${j[indice]+1}`
                vett[sdf] =j[opzione]
              }
              console.log("Passo da QUI")
              delete v.opzioni
              const versionedomanda = {...v, ...vett}
             //await dao.inserisciDomande(versionedomanda)
            }else{
              console.log("Sono Qui")
              //await  dao.inserisciDomande(v)
            }

      }*/
    res.status(201).json(id).end();
    }).catch((err) => { res.status(503).json({ errors: [{'param': 'Server', 'msg': err}]})})

});

app.delete("/api/questionari", async (req, res) => {
  
  await dao.cancellaQuestionari().then(() => {res.status(200).end()})
  .catch((err) => { res.status(503).json({ errors: [{'param': 'Server', 'msg': err}]})})
})

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});