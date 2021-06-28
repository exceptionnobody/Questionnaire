import { React, useState, useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import API from './API/API'
import { Container, Row, Button} from 'react-bootstrap/';
import Navigation from './components/Navigation';
import  LoginForm  from './components/LoginForm'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import {QuestionarioManager} from './components/QuestionarioManager';

function App() {
  const [ricaricaQuestionari, setRicaricaQuestionari] = useState(true)
  const [welcomeAdmin, setWelcomeAdmin] = useState({})
  const [mode, setMode] = useState('precarica')
  const [idQuestionari, setIdQuestionari] = useState(0)
  const [questionari, setQuestionari] = useState([])
  const [questionarioselezionato, setQuestionarioselezionato] = useState({});
  const [contaDomande, setContaDomande] = useState(0)
  const [loading, setLoading] = useState(true);
  const [domande, setDomande] = useState([])
  const [visualizzaDomande, setVisualizzaDomande] = useState([])
  const [message, setMessage] = useState({ msg: null });
  const [globalUser, setGlobalUser] = useState(false)
  const [submitButton, setSubimitButton] = useState(false)
  const [risposteGlobali, setRisposteGlobali] = useState([])
  const [utilizzatore, setUtilizzatore] = useState(null)

  const [utenti, setUtenti] = useState(null)
  const [idUtente, setIdUtente] = useState(null)
  const [primoCaricamento, setPrimoCaricamento] = useState(false)
  const [ricaricaUtenti, setRicaricaUtenti] = useState(false)
  const [ricaricaUtenti2, setRicaricaUtenti2] = useState(false)
  const [utentiSelezionati, setUtentiSelezionati] = useState([])
  const [numeroUtentiSelezionati, setNumeroUtentiSelezionati] = useState(0)
  const [idTemporaneoDopoCompilazione, setIdTemporaneo] = useState(0)
  const [loggedIn, setLoggedIn] = useState(false);
  const [bloccaRisposte] = useState(true)
  const [bloccaFiltri, setBloccaFiltri] = useState(false)
  const [admin, setAdmin] = useState({ id: null })

  const aggiungiQuestionario = () => {
    setMode('create');
  }

  const verificaRisposte = async (funzione) => {

    const numDomandeTotali = visualizzaDomande.length
    const array = new Array(numDomandeTotali).fill(0);

    for (const [i, v] of visualizzaDomande.entries()) {
      for (const k of risposteGlobali) {
        if (v.did === k.domanda && k.numrisposte >= v.min && k.numrisposte <= v.max) {

          array[i] = 1;

        }
      }
    }


    let conteggiorisposte = 0;
    for (const [i] of visualizzaDomande.entries()) {
      if (array[i] === 1)
        conteggiorisposte++;
    }

    if (conteggiorisposte === numDomandeTotali) {
      for (const v of risposteGlobali) {
        const temp = Object.assign({}, v)
        temp.user = utilizzatore.id
        await API.inserisciRisposta(temp)
      }

      await API.aggiornaNumUtentiQuestionario({ qid: questionarioselezionato.qid })

      setSubimitButton(false)
      setMessage({ msg: null })
      funzione(true)
      setMode('view')
      setUtilizzatore({})
      setRisposteGlobali([]);
      setVisualizzaDomande([])
      setBloccaFiltri(false)
      filtraQuestionario(idTemporaneoDopoCompilazione)

    } else {
      let errore = []
      for (let i = 0; i < numDomandeTotali; i++) {
        if (array[i] === 0) {
          errore.push({ msg: "Rispetta i vincoli della domanda: ", domanda: visualizzaDomande[i].quesito })
        }
      }
      setMessage(errore)
    }
  }


  const registraUser = (user) => {

    const TempUser = {
      nome: user,
      questionario: questionarioselezionato.qid
    }


    API.inserisciUtente(TempUser).then(uid => { TempUser.id = uid; setUtilizzatore({ ...TempUser }); setSubimitButton(true); setMode("compilaUtente") })

  }



  const chiudiQuestionario = () => {
    setMode('view');
  }

  const compilaQuestionario = (nameq) => {
    const questionariovett = [...questionari]

    questionariovett[idQuestionari] = { qid: idQuestionari, titolo: nameq, admin: admin.id, numdomande: 0, numutenti: 0 }

    API.inserisciUnNuovoQuestionario(questionariovett[idQuestionari]).then(result => {
      questionariovett[idQuestionari].qid = result;
      setQuestionari(questionariovett)
      setMode('compila')
    }
    )

  }

  const cancellaQuestionario = () => {
    const tempquest = [...questionari]
    const questionarioDaEliminare = tempquest.pop()
    setIdQuestionari(t => t-1)
    API.cancellaNuovoQuestionario(questionarioDaEliminare.qid).then(() => {

      setQuestionari([...tempquest])
      setMode('view')
      setIdQuestionari(t=>t+1)

    })

  }


  const doLogin = async (credentials) => {
    let risposta;

    try {

      const adminServer = await API.logIn(credentials);
      setAdmin(adminServer)
      setLoggedIn(true);
      setUtilizzatore(null)
      setVisualizzaDomande([])
      setQuestionarioselezionato({})
      setIdUtente(null)
      setQuestionari(questionari.filter(q => q.admin === adminServer.id))
      setIdQuestionari(questionari.filter(q => q.admin === adminServer.id).length ? questionari.filter(q => q.admin === adminServer.id).length : 0);
      let arr = []
      for (const e of questionari.filter(q => q.admin === adminServer.id)) {
        for (const v of domande) {
          if (v.questionario === e.qid)
            arr.push(v)
        }
      }
      setDomande([...arr])
      setContaDomande(arr.length)
      setWelcomeAdmin({ msg: `Welcome ${adminServer.name}`, color: adminServer.color });
      const utentiServer = await API.ottieniUtentiMieiQuestionari(adminServer.id)

      //recupero tutti gli utenti che hanno risposto ai questionari dell'admin corrente
      // per ogni utente recupero le sue risposte al questionario
      let vett = []
      let stringaopzione;
      for (const u of utentiServer) {

        risposta = await API.ottieniRisposteiMieiQuestionari(u.questionario, u.id)

        for (const p of risposta) {
          for (const d of domande) {
            if (p.domanda === d.did && p.tipo === 1) {
              for (let i = 0; i < d.numopzioni; i++) {
                stringaopzione = `opzione${i + 1}`
                vett.push({ valorerisposta: p[stringaopzione] ? 1 : 0, indice: i + 1, domanda: d[stringaopzione] })
              }
              p.opzioni = [...vett]
              vett = []
            }
          }

        }
        u.risposte = [...risposta]
      }
      setUtenti([...utentiServer]);

      <Redirect to="/admin" />

    } catch (err) {

      setMessage({ msg: "Unauthorized. Insert correct credentials.", color: 'danger' });

    }



  }

  const aggiungiDomandeQuestionario = async (domandeQuestionarioProv) => {

    const tempQuestionario = [...questionari]
    tempQuestionario[idQuestionari].domande = domandeQuestionarioProv
    tempQuestionario[idQuestionari].numdomande = domandeQuestionarioProv.length

    API.aggiornaNumDomandeQuestionario({ qid: tempQuestionario[idQuestionari].qid, numdomande: domandeQuestionarioProv.length })
      .then(() => {

        setQuestionari(tempQuestionario)
        for (const vv of domandeQuestionarioProv) {

          if (vv.tipo === 0)
            API.inserisciUnNuovaDomandaAperta(vv).then(did => { vv.did = did; })
          else
            API.inserisciUnNuovaDomandaChiusa(vv).then(did => { vv.did = did; })
        }
        setContaDomande(s => s + domandeQuestionarioProv.length)
        setMode('view')
        setLoading(true)
        setIdQuestionari(s => s + 1)
      })


  }

  const filtraQuestionario = (id) => {

    setQuestionarioselezionato(questionari[id])

    setVisualizzaDomande(domande.filter(d => d.questionario === questionari[id].qid))

    setUtentiSelezionati((loggedIn && utenti) ? [...utenti.filter(d => d.questionario === questionari[id].qid)] : [])

    setNumeroUtentiSelezionati((loggedIn && utenti) ? [...utenti.filter(d => d.questionario === questionari[id].qid)].length : 0)

    setIdUtente(0)
    if (!loggedIn) {
      setIdTemporaneo(id)
      setRicaricaQuestionari(true)
    }

  }

  const incrementeIdUtente = () => {
    setIdUtente(i => i + 1)
  }

  const decrementaIdUtente = () => {
    setIdUtente(i => i - 1)
  }


  const doLogOut = async () => {

    await API.logOut();

    setLoggedIn(false);

    setQuestionari([]);

    setAdmin({ id: null });
    setDomande([]);
    setLoading(true);
    setIdQuestionari(0)
    setVisualizzaDomande([])
    setQuestionarioselezionato([])
    setWelcomeAdmin({msg: "" });
    setUtilizzatore(null)
    setUtenti(null)
    setMode('view')
    setRicaricaQuestionari(true)
  }

  useEffect(() => {

    async function caricaQuestionari(aid) {

      const result = await API.ottieniMieiQuestionari(aid)


      setQuestionari(result);
      setIdQuestionari(result.length ? result.length - 1 : 0);
      setLoading(true)
      setRicaricaQuestionari(false)
      return result

    }

    if (admin.id === null && ricaricaQuestionari) {
      caricaQuestionari(admin.id).then(() => {
        setMode('view')
      })
    }


  }, [admin.id, ricaricaQuestionari])


  useEffect(() => {

    async function caricaDomande(tadmin) {

      const result = await API.ottieniDomande(tadmin.id)


      setLoading(false)

      return result
    }

    if (loading) {
      caricaDomande(admin).then(result => {

        for (const v of result) {
          if (v.tipo) {
            let arr = []
            for (let p = 0; p < v.numopzioni; p++) {
              let stringaopzione = `opzione${p + 1}`
              arr.push({ opzione: v[stringaopzione] })
            }
            v.opzioni = [...arr]
          }
        }


        setDomande(result);
        setContaDomande(result.length)
      })
    }

  }, [loading, admin])

  useEffect(() => {

    async function caricaUtilizzatori(aid) {

      let risposta;
      //recupero tutti gli utenti che hanno risposto ai questionari dell'admin corrente

      // per ogni utente recupero le sue risposte al questionario
      const copiautenti = [...utenti]
      for (const u of copiautenti) {

        risposta = await API.ottieniRisposteiMieiQuestionari(u.questionario, u.id)
        let arr = []
        let stringaopzione;
        for (const p of risposta) {
          for (const d of domande) {
            if (p.domanda === d.did && p.tipo === 1) {
              for (let i = 0; i < d.numopzioni; i++) {
                stringaopzione = `opzione${i + 1}`
                arr.push({ valorerisposta: p[stringaopzione] ? 1 : 0, indice: i + 1, domanda: d[stringaopzione] })
              }
              p.opzioni = [...arr]
              arr = []
            }
          }

        }
        u.risposte = [...risposta]
      }
      setPrimoCaricamento(false)
      setUtenti(copiautenti)
    }

    if (primoCaricamento && utenti !== null) {

      caricaUtilizzatori(admin.id)

    }

  }, [utenti, admin.id, domande, primoCaricamento])

  useEffect(() => {

    async function caricaQuestionari(aid) {

      const result = await API.ottieniMieiQuestionari(aid)
      setRicaricaUtenti2(false)
      setQuestionari(result);
      setIdQuestionari(result? result.length:0)
    }

    if (loggedIn && ricaricaUtenti2) {
      caricaQuestionari(admin.id).then(() => {
        setRicaricaUtenti(true)

      })
    }


  }, [ricaricaUtenti2, admin.id, loggedIn, idTemporaneoDopoCompilazione])

  useEffect(() => {

    async function caricaUtilizzatori(tadmin) {

      let risposta;
      //recupero tutti gli utenti che hanno risposto ai questionari dell'admin corrente
      const utentierver = await API.ottieniUtentiMieiQuestionari(tadmin.id)

      // per ogni utente recupero le sue risposte al questionario
      for (const u of utentierver) {

        risposta = await API.ottieniRisposteiMieiQuestionari(u.questionario, u.id)
        let arr = []
        let stringaopzione;
        for (const p of risposta) {
          for (const d of domande) {
            if (p.domanda === d.did && p.tipo === 1) {
              for (let i = 0; i < d.numopzioni; i++) {
                stringaopzione = `opzione${i + 1}`
                arr.push({ valorerisposta: p[stringaopzione] ? 1 : 0, indice: i + 1, domanda: d[stringaopzione] })
              }
              p.opzioni = [...arr]
              arr = []
            }
          }

        }
        u.risposte = [...risposta]
      }

      setRicaricaUtenti(false)
      setUtenti(utentierver)
    }

    if (loggedIn && ricaricaUtenti) {

      caricaUtilizzatori(admin)

    }

  }, [ricaricaUtenti, utenti, admin, domande, questionarioselezionato, questionari, loggedIn])


  useEffect(()=> {

    const checkAuth = async() => {

      try {
        const userInfo= await API.getUserInfo();
        setAdmin(userInfo);
        setLoggedIn(true);
        setRicaricaUtenti2(true)
        setUtilizzatore(null)
        setIdUtente(null)
        setWelcomeAdmin({ msg: `Welcome ${userInfo.name}`, color: userInfo.color });
      } catch(err) {
        console.error(err.error);
      }

    };

        checkAuth();

  }, []);



  return (

    <Container fluid>
      <Router>
        <Navigation setGlobalUser={setGlobalUser} globalUser={globalUser} registraUser={registraUser} loggedIn={loggedIn} message={welcomeAdmin} doLogOut={doLogOut} bloccaFiltri={!bloccaFiltri} />
        <Switch>
          <Route exact path="/">
            {!loggedIn ?
            <Row className="vh-100">

              <QuestionarioManager bloccaRisposte={bloccaRisposte} loggedIn={loggedIn} submitButton={submitButton} setRisposteGlobali={setRisposteGlobali} verificaRisposte={verificaRisposte}
                contaDomande={contaDomande} myDomande={visualizzaDomande} setGlobalUser={setGlobalUser} message={message}
                questionari={questionari} setQuestionari={setQuestionari} setMode={setMode}  setMessage={setMessage}
                questionarioselezionato={questionarioselezionato} filtraQuestionario={filtraQuestionario} 
                mode={mode} idQuestionari={idQuestionari} compilaQuestionario={compilaQuestionario} bloccaFiltri={bloccaFiltri} setBloccaFiltri={setBloccaFiltri} >


              </QuestionarioManager>

            </Row>: <Redirect to="/admin" />}
          </Route>

          <Route path="/login">
            {loggedIn ? <Redirect to="/admin" /> : <LoginForm message={message} login={doLogin} />}
          </Route>

          <Route path="/admin">
          {loggedIn ?   <Row className="vh-100">
          
          <QuestionarioManager bloccaRisposte={bloccaRisposte} loggedIn={loggedIn} utentiSelezionati={utentiSelezionati} idUtente={idUtente} lunghezzautenti={numeroUtentiSelezionati}
                submitButton={submitButton}  incrementeIdUtente={incrementeIdUtente} decrementaIdUtente={decrementaIdUtente} compilaQuestionario={compilaQuestionario}
                contaDomande={contaDomande} myDomande={visualizzaDomande} message={message} setRicaricaUtenti2={setRicaricaUtenti2}
                questionari={questionari} setQuestionari={setQuestionari} setMode={setMode} aggiungiDomandeQuestionario={aggiungiDomandeQuestionario} setMessage={setMessage}
                questionarioselezionato={questionarioselezionato} filtraQuestionario={filtraQuestionario} cancellaQuestionario={cancellaQuestionario}
                mode={mode} idQuestionari={idQuestionari}  bloccaFiltri={bloccaFiltri} setBloccaFiltri={setBloccaFiltri} >


              </QuestionarioManager>

            {loggedIn && mode === "view" && <Button variant="success" size="lg" className="fixed-right-bottom" onClick={aggiungiQuestionario}>+</Button>}
            {loggedIn && mode === "create" && <Button variant="success" size="lg" className="fixed-right-bottom btn btn-lg btn-danger" onClick={chiudiQuestionario}>X</Button>}
          </Row> : <Redirect to="/"/>}
          </Route>

          <Route path="/:param">
            {loggedIn ? <Redirect to="/admin" /> : <Redirect to="/" />}
          </Route>

        </Switch>
      </Router>
    </Container>

  );
}


export default App;
