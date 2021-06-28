'use strict';

const express = require('express');
const {validationResult, check} = require('express-validator'); // validation middleware
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

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.status(200).json(req.user);}
  else
    res.status(401).json({error: 'Unauthenticated user!'});
});

app.delete('/api/sessions/current', (req, res) => {
  req.logout();
  res.end();
});


// Parametrica /api/questionari?admin=?
app.get('/api/questionari',[check('admin').exists({ checkNull: false })], async (req, res) => {

  const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

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
app.get('/api/domande',[check('admin').exists({ checkNull: false })] ,async (req, res) => {

  const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

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

app.post('/api/questionari',[check('qid').isInt({ min: 0 }), check('admin').isInt({min: 0}), check('titolo').isString(), check('numdomande').isInt({ min: 0 }), check('admin').isInt({ min: 1 })] ,isLoggedIn,async (req, res) => {
 
  const errors = validationResult(req);
  if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() })


  const questionario = {
    qid: req.body.qid,
    admin: req.body.admin,
    titolo: req.body.titolo,
    numdomande: req.body.numdomande
  };
 
 dao.createQuestionario(questionario).then((qid)=>{res.status(201).json(qid).end()})
                                    .catch((err)=>{  res.status(503).json({ errors: [{'param': 'Server', 'msg': err}]}) })

 })


 app.put('/api/questionari', [check('qid').isInt({min: 0})],async (req, res) => {
 
  const errors = validationResult(req);
  if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() })

  const questionario = {
    qid: req.body.qid
  };

 dao.aggiornaNumUtenti(questionario).then((result)=>{res.status(201).json(result).end()})
                                    .catch((err)=>{  res.status(503).json({ errors: [{'param': 'Server', 'msg': err}]}) })

 })

 app.put('/api/domande', [check('qid').isInt({min: 0}), check('numdomande').isInt({min: 1})], isLoggedIn ,async (req, res) => {
 
  const errors = validationResult(req);
  if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() })

  const questionario = {
    qid: req.body.qid,
    numdomande: req.body.numdomande
  };

 dao.aggiornaNumDomande(questionario).then((result)=>{res.status(201).json(result).end()})
                                    .catch((err)=>{  res.status(503).json({ errors: [{'param': 'Server', 'msg': err}]}) })

 })


 app.post('/api/domandeaperte', 
 
 [check('did').isInt({min: 0}),
 check('qid').isInt({min: 0}),
 check('quesito').isString(),
 check('min').isInt({min: 0}),
 check('max').isInt({min: 1}),
 check('tipo').isInt({min: 0, max:1}),
 check('numopzioni').isInt({min: 1}),
 check('obbligatoria').isInt({min: 0, max:1}),
]
 ,isLoggedIn, async (req, res) => {
 
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

 dao.inserisciDomandeAperta(domanda).then((did)=>{res.status(201).json(did).end()})
                                    .catch((err)=>{  res.status(503).json({ errors: [{'param': 'Server', 'msg': err}]}) })

 })


 app.post('/api/domandechiuse',
 [check('did').isInt({min: 0}),
 check('qid').isInt({min: 0}),
 check('quesito').isString(),
 check('min').isInt({min: 0}),
 check('max').isInt({min: 1}),
 check('tipo').isInt({min: 0, max:1}),
 check('numopzioni').isInt({min: 1}),
 check('obbligatoria').isInt({min: 0, max:1}),
 check('opzione1').isString().optional(),
 check('opzione2').isString().optional(),
 check('opzione3').isString().optional(),
 check('opzione4').isString().optional(),
 check('opzione5').isString().optional(),
 check('opzione6').isString().optional(),
 check('opzione7').isString().optional(),
 check('opzione8').isString().optional(),
 check('opzione9').isString().optional(),
 check('opzione10').isString().optional(),
]
 ,isLoggedIn,async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() })

  const domanda = {
 
   did: req.body.did,
   qid: req.body.qid,
   quesito: req.body.quesito,
   min: req.body.min,
   max: req.body.max,
   tipo: req.body.tipo,
   numopzioni: req.body.numopzioni,
   obbligatoria: req.body.obbligatoria,
   opzione1: req.body.opzione1,
   opzione2: req.body.opzione2,
   opzione3: req.body.opzione3,
   opzione4: req.body.opzione4,
   opzione5: req.body.opzione5,
   opzione6: req.body.opzione6,
   opzione7: req.body.opzione7,
   opzione8: req.body.opzione8,
   opzione9: req.body.opzione9,
   opzione10: req.body.opzione10
   
 }
 
  dao.inserisciDomandeChiusa(domanda).then((did)=>{res.status(201).json(did).end()})
                                     .catch((err)=>{  res.status(503).json({ errors: [{'param': 'Server', 'msg': err}]}) })
 
  })
 


app.post("/api/utenti", [
check('nome').isString(),
check('questionario').isInt({min: 0})
],async (req, res) => {

const utente = {
  nome: req.body.nome,
  questionario: req.body.questionario
}

dao.inserisciUser(utente).then((id)=>{res.status(200).json(id).end()})
                          .catch((err) => { res.status(503).json({ errors: [{'param': 'Server', 'msg': err}]})})
})

app.post("/api/risposte", 
[

  check('domanda').isInt(),
  check('user').isInt(),
  check('tipo').isInt({min:0, max:1}),
  check('numrisposte').isInt({min: 1}),
  check('opzione1').isInt({ min: 0, max: 1 }).optional(),
  check('opzione2').isInt({ min: 0, max: 1 }).optional(),
  check('opzione3').isInt({ min: 0, max: 1 }).optional(),
  check('opzione4').isInt({ min: 0, max: 1 }).optional(),
  check('opzione5').isInt({ min: 0, max: 1 }).optional(),
  check('opzione6').isInt({ min: 0, max: 1 }).optional(),
  check('opzione7').isInt({ min: 0, max: 1 }).optional(),
  check('opzione8').isInt({ min: 0, max: 1 }).optional(),
  check('opzione9').isInt({ min: 0, max: 1 }).optional(),
  check('opzione10').isInt({ min: 0, max: 1 }).optional(),
  check('opzioneaperta').isString().optional()

]
,async (req, res) => {

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
dao.inserisciRisposte(risposta).then((id)=>{res.status(200).json(id).end()})
                              .catch((err) => { res.status(503).json({ errors: [{'param': 'Server', 'msg': err}]})})
  })

// Dato un questionario mi dà tutte le risposte di un dato user
// Parametrica: questionario=valore&user=valore;
  app.get("/api/risposte", [check('questionario').isInt({ min: 1 }), [check('utente').isInt({ min: 1 })] ] , isLoggedIn, async (req, res) => {

    const errors = validationResult(req);
  if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() })

  let obj = {
      questionario: +req.query.questionario,
      utente: +req.query.utente
   }
  
      dao.ottieniRisposteDaUtente(obj).then((risultato)=>{res.status(200).json(risultato).end()})
                  .catch((err) => { res.status(503).json({ errors: [{'param': 'Server', 'msg': err}]})})
    })

// Mi serve trovare tutti gli utenti che hanno risposto ai questionari di un dato admin
// Parametrica: ?admin=valore
app.get("/api/utenti",[check('admin').isInt({ min: 1 })], isLoggedIn,async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() })

  let obj;
 
  
  obj = {
    admin: +req.query.admin,
     
  }
  
  dao.ottieniUtentiDatoAdmin(obj).then((risultato)=>{res.status(200).json(risultato).end()})
                .catch((err) => { res.status(503).json({ errors: [{'param': 'Server', 'msg': err}]})})
  })



app.delete("/api/questionari/:qid", [check('qid').isInt({ min: 1 })], isLoggedIn ,(req,res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

  dao.cancellaQuestionario(req.params.qid).then(() => {res.status(200).end()})
                                            .catch((err) => { res.status(503).json({ errors: [{'param': 'Server', 'msg': err}]})})
    }
);

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});