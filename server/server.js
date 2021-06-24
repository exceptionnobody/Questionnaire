'use strict';

const express = require('express');
const dao = require('./dao');
const morgan = require('morgan');
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const userDao = require('./user-dao');

// init express
const app = new express();
const port = 3001;


// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
  function(username, password, done) {
      userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password.' });
        
      return done(null, user);
    })
  }
));

// serialize and de-serialize the user (user object <-> session)
  // we serialize the user id and we store it in the session: the session is very small in this way
  passport.serializeUser((user, done) => {
    //console.log("serializeUser: user:" + JSON.stringify(user));
    done(null, user.id);
  });
  
  // starting from the data in the session, we extract the current (logged-in) user
  passport.deserializeUser((id, done) => {
    //console.log("deserializeUser: id:" + id);
    userDao.getUserById(id)
      .then(user => {
        //console.log("deserializeUser: user da db:" + JSON.stringify(user));
        done(null, user); // this will be available in req.user
      }).catch(err => {
        done(err, null);
      });
  });

  // set up the session
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
  resave: false,
  saveUninitialized: false,
}));

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated())
    return next();
  
  return res.status(401).json({ error: 'not authenticated'});
}
// then, init passport
app.use(passport.initialize());
app.use(passport.session());

app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        // this is coming from userDao.getUser()
        return res.json(req.user);
      });
  })(req, res, next);
});

// Parametrica /api/questionari?admin=?
app.get('/api/questionari', async (req, res) => {

  try {
    
    let result
    const idAdmin = {
      admin: req.query.admin
    }

    if(idAdmin.admin.toString() !== "null")
      result = await dao.getAllMyQuestionnaire(idAdmin.admin);
    else
      result = await dao.getAllQuestionnaires();

    if (result.error)
        res.status(404).json(result);
    else
        res.json(result);
} catch (err) {
    res.status(503).json({error: `Database error during query execution.`});
}

})

// Query parametrica /api/domande?admin=valore
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


 app.put('/api/questionari', async (req, res) => {
 
  const questionario = {
    qid: req.body.qid
  };

 console.log(questionario)
 dao.aggiornaNumUtenti(questionario).then((result)=>{
   console.log("Aggiornamento andato a buon fine "+ result)
   res.status(201).json(result).end()
 }).catch((err)=>{  res.status(503).json({ errors: [{'param': 'Server', 'msg': err}]}) })

 })

 app.put('/api/domande', async (req, res) => {
 
  const questionario = {
    qid: req.body.qid,
    numdomande: req.body.numdomande
  };

 console.log(questionario)
 dao.aggiornaNumDomande(questionario).then((result)=>{
   console.log("Aggiornamento andato a buon fine "+ result)
   res.status(201).json(result).end()
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
  numopzioni: req.body.numopzioni,
  obbligatoria: req.body.obbligatoria
  
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
  
  dao.cancellaQuestionari().then(() => {res.status(200).end()})
  .catch((err) => { res.status(503).json({ errors: [{'param': 'Server', 'msg': err}]})})
})


app.post("/api/utenti", async (req, res) => {

const utente = {
  nome: req.body.nome,
  questionario: req.body.questionario
}
console.log(utente)
  dao.inserisciUser(utente).then((id)=>{res.status(200).json(id).end()})
              .catch((err) => { res.status(503).json({ errors: [{'param': 'Server', 'msg': err}]})})
})

app.post("/api/risposte", async (req, res) => {

  let risposta;
 
  
  risposta = {
    domanda: req.body.domanda,
    user: req.body.user,
    tipo: req.body.tipo,
    numrisposte: req.body.numrisposte, 
    opzione1: req.body.opzione1, 
    opzione2: req.body.opzione2, 
    opzione3: req.body.opzione3, 
    opzione4: req.body.opzione4,
    opzione5: req.body.opzione5,
    opzione6: req.body.opzione6,
    opzione7: req.body.opzione7,
    opzione8: req.body.opzione8, 
    opzione9: req.body.opzione9, 
    opzione10: req.body.opzione10,
    opzioneaperta: req.body.opzioneaperta
 

}
console.log(risposta)
    dao.inseriscRisposte(risposta).then((id)=>{res.status(200).json(id).end()})
                .catch((err) => { res.status(503).json({ errors: [{'param': 'Server', 'msg': err}]})})
  })

// Dato un questionario mi dà tutte le risposte di un dato user
// Parametrica: questionario=valore&user=valore;
  app.get("/api/risposte", async (req, res) => {

    let obj;
   
    
    obj = {
      questionario: +req.query.questionario,
      utente: +req.query.utente
       
  }
  console.log(obj)
      dao.ottieniRisposteDaUtente(obj).then((risultato)=>{res.status(200).json(risultato).end()})
                  .catch((err) => { res.status(503).json({ errors: [{'param': 'Server', 'msg': err}]})})
    })

// Mi serve trovare tutti gli utenti che hanno risposto ai questionari di un dato admin
// Parametrica: ?admin=valore
app.get("/api/utenti", async (req, res) => {

  let obj;
 
  
  obj = {
    admin: +req.query.admin,
     
}
console.log(obj)
    dao.ottieniUtentiDatoAdmin(obj).then((risultato)=>{res.status(200).json(risultato).end()})
                .catch((err) => { res.status(503).json({ errors: [{'param': 'Server', 'msg': err}]})})
  })



  app.delete("/api/questionari/:qid", (req,res) => {

    //const errors = validationResult(req);
    //if (!errors.isEmpty())
   //     return res.status(422).json({ errors: errors.array() })

   dao.cancellaQuestionario(+req.params.qid).then(() => {res.status(200).end()})
  .catch((err) => { res.status(503).json({ errors: [{'param': 'Server', 'msg': err}]})})
    }
);

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});