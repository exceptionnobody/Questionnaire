import { React, useState, useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import API from './API/API'
import { Container, Row, Col, Button, Alert } from 'react-bootstrap/';
import { ArrowRight, ArrowLeft } from 'react-bootstrap-icons';
import ContentList from './components/ContentList'
import Navigation from './components/Navigation';
import Filters from './components/Filter'
import FormPersonale from './components/FormPersonale';
import DomandeMenu from './components/DomandeMenu';
import DomandaAperta from './components/DomandaAperta';
import {LoginForm} from './components/LoginForm'
import DomandaChiusa from './components/DomandaChiusa';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

function App() {
  const [ricaricaQuestionari, setRicaricaQuestionari] = useState(true)
  const [welcomeAdmin, setWelcomeAdmin] = useState({})
  const [mode, setMode]=useState('precarica')
  const [idQuestionari, setIdQuestionari] = useState(0)
  const [questionari, setQuestionari] =useState([])
  const [questionarioselezionato, setQuestionarioselezionato] = useState({});
  const [contaDomande, setContaDomande] = useState(0)
  const [loading, setLoading] = useState(true);
  const [domande, setDomande] = useState([])
  const [visualizzaDomande, setVisualizzaDomande] = useState([])
  const [message, setMessage] = useState({msg:null});
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
  const [admin, setAdmin] = useState({id:null})

  const aggiungiQuestionario = ()=>{
      setMode('create');
  }

const verificaRisposte = async (funzione)=>{
  
  const numDomandeTotali = visualizzaDomande.length
  const array = new Array(numDomandeTotali).fill(0);

  for(const [i,v] of visualizzaDomande.entries()){
  for(const k of risposteGlobali){
    if(v.did === k.domanda && k.numrisposte >= v.min && k.numrisposte <= v.max){
    
      array[i]=1;
      console.log(array)
      
    }
  }
}  


let conteggiorisposte=0;
  for(const [i] of visualizzaDomande.entries()){
    if(array[i] ===1)
      conteggiorisposte++;
  }
  console.log("CONTEGGIO RISPOSTE: "+conteggiorisposte)
  if(conteggiorisposte === numDomandeTotali){
    console.log("posso inviare il questionario")
    for(const v of risposteGlobali){
      const temp = Object.assign({},v)
      temp.user = utilizzatore.id
      await  API.inserisciRisposta(temp)
    }
    await API.aggiornaNumUtentiQuestionario({qid:questionarioselezionato.qid})
    setSubimitButton(false)
    setMessage({msg: null})
    funzione(true)
    setMode('view')
    setUtilizzatore({})
    setRisposteGlobali([]);
    setVisualizzaDomande([])
    filtraQuestionario(idTemporaneoDopoCompilazione)
  }else{
    console.log("Questionario non valido")
    let errore = []
    for(let i =0; i< numDomandeTotali; i++){
      if(array[i]===0){
        errore.push({msg: "Rispetta i vincoli della domanda: ", domanda: visualizzaDomande[i].quesito})
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

 
  API.inserisciUtente(TempUser).then(uid=> {TempUser.id=uid; setUtilizzatore({...TempUser}); setSubimitButton(true); setMode("compilaUtente")})
  
}



  const chiudiQuestionario = () =>{
    setMode('view');
  }

  const compilaQuestionario = (nameq) => {
      const questionariovett = [...questionari]

      questionariovett[idQuestionari] = {qid: idQuestionari , titolo: nameq, admin:admin.id, numdomande:0, numutenti:0}

      API.inserisciUnNuovoQuestionario(questionariovett[idQuestionari]).then(result => {
        questionariovett[idQuestionari].qid = result;
        setQuestionari(questionariovett) 
        setMode('compila')
      }      
        )
      
  }
 
  const cancellaQuestionario = () => {
    const tempquest= [...questionari]
    const questionarioDaEliminare = tempquest.pop()
    setIdQuestionari(t => t-1)
    API.cancellaNuovoQuestionario(questionarioDaEliminare.qid).then(()=>{

      setQuestionari([...tempquest])
      setMode('view')  
    
    })

  }


  const doLogin = async (credentials) => {
    let risposta;

    try {

      const adminServer = await API.logIn(credentials);

      console.log("Login effettuato corretamente");
      
      setAdmin(adminServer)
      setLoggedIn(true);
      setUtilizzatore(null)
      setVisualizzaDomande([])
      setQuestionarioselezionato({})
      setIdUtente(null)
      setQuestionari(questionari.filter(q=> q.admin === adminServer.id))
      setIdQuestionari(questionari.filter(q=> q.admin === adminServer.id).length?questionari.filter(q=> q.admin === adminServer.id).length:0);
      let arr = []
      for(const e of questionari.filter(q=> q.admin === adminServer.id)){
        for(const v of domande){
          if(v.questionario === e.qid)
            arr.push(v)
        }
      }
      setDomande([...arr])
      setContaDomande(arr.length)
      setWelcomeAdmin({msg: `Welcome ${adminServer.name}`, color: adminServer.color});
      const utentiServer = await API.ottieniUtentiMieiQuestionari(adminServer.id)

      //recupero tutti gli utenti che hanno risposto ai questionari dell'admin corrente

      // per ogni utente recupero le sue risposte al questionario
      let vett=[]
      let stringaopzione;
      for(const u of utentiServer){

        risposta = await API.ottieniRisposteiMieiQuestionari(u.questionario, u.id)

        for(const p of risposta){
          for(const d of domande){
              if(p.domanda === d.did && p.tipo ===1){
                for(let i=0; i < d.numopzioni; i++){
                  stringaopzione = `opzione${i+1}`
                  vett.push({valorerisposta: p[stringaopzione]?1:0, indice: i+1, domanda: d[stringaopzione]})
              }
              p.opzioni = [...vett]
              vett=[]
            }
          }

        }
      u.risposte = [...risposta]
       } 
      setUtenti([...utentiServer]);


      <Redirect to="/"/>

      // il valore di loggedIn non cambia

     // setMessage({msg: `Welcome, ${userFromServer.name}!`, color: `${userFromServer.color}`});

    } catch (err) {

      setMessage({msg: "Unauthorized. Insert correct credentials.", color: 'danger'});

    }



  }

  const aggiungiDomandeQuestionario = async (domandeQuestionarioProv)=>{
    
    const tempQuestionario = [...questionari]
    tempQuestionario[idQuestionari].domande = domandeQuestionarioProv
    tempQuestionario[idQuestionari].numdomande = domandeQuestionarioProv.length
    
    API.aggiornaNumDomandeQuestionario({qid: tempQuestionario[idQuestionari].qid, numdomande: domandeQuestionarioProv.length})
    .then(()=>{

      setQuestionari(tempQuestionario)
      for(const vv of domandeQuestionarioProv){
      
        if(vv.tipo === 0)
             API.inserisciUnNuovaDomandaAperta(vv).then(did=> {vv.did=did; })
         else
             API.inserisciUnNuovaDomandaChiusa(vv).then(did=> {vv.did=did;})
        }
        setContaDomande(s => s+domandeQuestionarioProv.length)  
        setMode('view')
        setLoading(true)
        setIdQuestionari(s => s+1)
    })
    

} 

  const filtraQuestionario = (id) => {

    setQuestionarioselezionato(questionari[id])
    //console.log("QID Questionario selezionato "+questionari[id].qid)
    //console.log("ID QUESTIONARIO NELL'ARRAY: "+id)
    setVisualizzaDomande(domande.filter(d => d.questionario === questionari[id].qid))


      
    setUtentiSelezionati((loggedIn&&utenti)?[...utenti.filter(d => d.questionario === questionari[id].qid)]:[])

    setNumeroUtentiSelezionati((loggedIn&&utenti)?[...utenti.filter(d => d.questionario === questionari[id].qid)].length:0)

    setIdUtente(0) 
    if(!loggedIn){
      setIdTemporaneo(id)
      setRicaricaQuestionari(true)
    }

  } 

  const incrementeIdUtente = () => {
    setIdUtente(i=> i+1)
  }

  const decrementaIdUtente = ()=>{
    setIdUtente(i=>i-1)
  }


  const doLogOut = async () => {

    await API.logOut();

    setLoggedIn(false);

    setQuestionari([]);

    setAdmin({id:null});
    setDomande([]);
    setLoading(true);
    setIdQuestionari(0)
    setVisualizzaDomande([])
    setQuestionarioselezionato([])
    setWelcomeAdmin({msg: ""});
    setUtilizzatore(null)
    setUtenti(null)
    setRicaricaQuestionari(true)
  }

  useEffect(() => {

    async function caricaQuestionari(aid) {

      const result = await API.ottieniMieiQuestionari(aid)
      
      
      setQuestionari(result);
      setIdQuestionari(result.length?result.length-1:0);
      setLoading(true) 
      setRicaricaQuestionari(false)
      return result
           
    }

    if(admin.id===null && ricaricaQuestionari){
      caricaQuestionari(admin.id).then((result) => { 
        
       console.log(result)
       setMode('view') 
       console.log("QUI")
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

        for(const v of result){
          if(v.tipo){
            let arr = []
            for(let p=0; p<v.numopzioni; p++){
              let stringaopzione = `opzione${p+1}`
              arr.push({opzione: v[stringaopzione]})
            }
            v.opzioni = [...arr]
          }
        }


        setDomande(result); 
        setContaDomande(result.length)

        console.log("Domande")
        console.log(result)
      })
    }

  }, [loading,  admin])

  useEffect(() => {

    async function caricaUtilizzatori(aid) {

      let risposta;
      //recupero tutti gli utenti che hanno risposto ai questionari dell'admin corrente

      // per ogni utente recupero le sue risposte al questionario
      const copiautenti = [...utenti]
      for(const u of copiautenti){

        risposta = await API.ottieniRisposteiMieiQuestionari(u.questionario, u.id)
        let arr=[]
        let stringaopzione;
        for(const p of risposta){
          for(const d of domande){
              if(p.domanda === d.did && p.tipo ===1){
                for(let i=0; i < d.numopzioni; i++){
                  stringaopzione = `opzione${i+1}`
                  arr.push({valorerisposta: p[stringaopzione]?1:0, indice: i+1, domanda: d[stringaopzione]})
              }
              p.opzioni = [...arr]
              arr=[]
            }
          }

        }
      u.risposte = [...risposta]
       }
       setPrimoCaricamento(false)     
       setUtenti(copiautenti)          
    }

    if (primoCaricamento && utenti !== null) {

      caricaUtilizzatori(admin.id).then(() => { 

       console.log("TEST")
      })

    }

  }, [utenti, admin.id, domande, primoCaricamento])

  useEffect(() => {

    async function caricaQuestionari(aid) {

      const result = await API.ottieniMieiQuestionari(aid)
      setRicaricaUtenti2(false)
      setQuestionari(result);           
    }

    if(loggedIn && ricaricaUtenti2){
      caricaQuestionari(admin.id).then(() => { 
        
       console.log("Ricarica Questionari") 
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
      for(const u of utentierver){

        risposta = await API.ottieniRisposteiMieiQuestionari(u.questionario, u.id)
        let arr=[]
        let stringaopzione;
        for(const p of risposta){
          for(const d of domande){
              if(p.domanda === d.did && p.tipo ===1){
                for(let i=0; i < d.numopzioni; i++){
                  stringaopzione = `opzione${i+1}`
                  arr.push({valorerisposta: p[stringaopzione]?1:0, indice: i+1, domanda: d[stringaopzione]})
              }
              p.opzioni = [...arr]
              arr=[]
            }
          }

        }
      u.risposte = [...risposta]
       }
 
       setRicaricaUtenti(false)
       setUtenti(utentierver)         
    }

    if (loggedIn && ricaricaUtenti) {

      caricaUtilizzatori(admin).then(() => { 
       console.log("TEST Ricarica Utenti")
      })

    }
 
  }, [ricaricaUtenti, utenti, admin, domande, questionarioselezionato, questionari, loggedIn])

  return (

    <Container fluid>
      <Router>
      <Navigation setGlobalUser={setGlobalUser} globalUser={globalUser} registraUser={registraUser} loggedIn={loggedIn} message={welcomeAdmin} doLogOut={doLogOut}/>
      <Switch>
      <Route exact path="/">
      <Row className="vh-100">

      <QuestionarioManager  bloccaRisposte={bloccaRisposte} loggedIn={loggedIn} utentiSelezionati={ utentiSelezionati} idUtente={idUtente} lunghezzautenti={numeroUtentiSelezionati}
      submitButton={submitButton} setRisposteGlobali={setRisposteGlobali} verificaRisposte={verificaRisposte} incrementeIdUtente={incrementeIdUtente} decrementaIdUtente={decrementaIdUtente}
      contaDomande={contaDomande} myDomande={visualizzaDomande} setGlobalUser={setGlobalUser} message={message} setRicaricaUtenti2={setRicaricaUtenti2}
      questionari={questionari} setQuestionari={setQuestionari}  setMode={setMode} aggiungiDomandeQuestionario={aggiungiDomandeQuestionario}
      questionarioselezionato={questionarioselezionato} filtraQuestionario={filtraQuestionario} cancellaQuestionario={cancellaQuestionario}
      mode={mode} idQuestionari={idQuestionari} chiudiQuestionario={chiudiQuestionario} compilaQuestionario={compilaQuestionario} >


      </QuestionarioManager>

      </Row>
      {loggedIn && mode === "view" && <Button variant="success" size="lg" className="fixed-right-bottom" onClick={aggiungiQuestionario}>+</Button>}
      {loggedIn && mode === "create" && <Button variant="success" size="lg" className="fixed-right-bottom btn btn-lg btn-danger" onClick={chiudiQuestionario}>X</Button>}
      </Route>

      <Route path="/login">
      
      {loggedIn ? <Redirect to="/"/> : <LoginForm message={message} login={doLogin}/>}
     

      </Route>

      </Switch>
      </Router>
      </Container>

  );
}

const QuestionarioManager = (props) => {

  const {mode, contaDomande, filtraQuestionario, myDomande, idQuestionari, chiudiQuestionario, compilaQuestionario, questionari,  aggiungiDomandeQuestionario, questionarioselezionato, cancellaQuestionario } = props;
  const {setGlobalUser, submitButton, setRisposteGlobali, verificaRisposte, message, loggedIn, utentiSelezionati, lunghezzautenti, idUtente, incrementeIdUtente, decrementaIdUtente, setRicaricaUtenti2 } = props
  const [ domande, setDomande] = useState([])
  const [ showDomanda, setShowDomanda] = useState()
  const [did, setDid] = useState(0);
  const [modo, setModo] = useState('')
  const [showCompila, setShowCompila] = useState(false)


  const pubblicaQuestionario= () =>{
    let newId;
    if(domande.length >=1){

     const tempDomande = [...domande]

     newId = contaDomande;
     for(const v of tempDomande){
       v.modificabile=false
       if(v.qid !== 0){
            v.did = newId;
            newId++;
       }
     }

     setDid(0)
     setModo('view')
     aggiungiDomandeQuestionario(tempDomande)

    
     setDomande([])
    }else{

    }

    }

  const opzioneDomande = {
    'D1': { label: 'Aggiungi Domanda Chiusa', id: 'd1', fnc: ()=>{setShowDomanda(true); setModo("chiusa")}},
    'D2': { label: 'Aggiungi Domanda Aperta', id: 'd2', fnc: ()=>{setShowDomanda(true); setModo("aperta")}},
    'D3': { label: "Pubblica Questionario", id: 'd3', fnc: pubblicaQuestionario},
    'D4': { label: "Cancella Questionario", id:"d4", fnc: ()=>cancellaQuestionario()}
  };


  const aggiungiDomanda = (domanda) =>{
         setDomande(s => [...s, domanda]);
        setShowDomanda(false);
        setModo("temp")
        setDid(d => d+1)
  }

  const SpostaElementi = function(old_index, new_index) {
    let arr = [...domande];
    const val1 = {...domande[old_index]};
    const val2 = {...domande[new_index]}

    arr[old_index] = arr[new_index]
    arr[new_index] = val1

    arr[old_index].did = val1.did
    arr[new_index].did = val2.did
    setDomande(arr)
  }


  const CancellaDomanda = (index) =>{

    const tempDomande = domande.filter(t => t.did !== index);
    let i=0;
    for(const v of tempDomande){
      v.did=i;
      i++; 
    }
    i++
    setDid(i)
    setDomande(tempDomande)
  }

  return (<>
        <Col xs={3} bg="light" className="below-nav" id="left-sidebar" key={"filtri"}>
          {(mode === 'view' || mode==="compilaUtente") && <Filters items={questionari} filtraQuestionario={filtraQuestionario} setShowCompila={setShowCompila} loggedIn={loggedIn} setRicaricaUtenti2={setRicaricaUtenti2} />}
          {mode === 'compila' && <DomandeMenu items={opzioneDomande} aggiungiDomanda={aggiungiDomanda}  />}
        </Col>      
      <Col xs={9} className="below-nav" id="main" key={"main"} >
        {mode ==="compilaUtente" && <><h2 className="pb-3">{questionarioselezionato.titolo} <small className="text-muted"></small>
                                </h2>
                                {message.msg!==null && message.map((t,i) =>  <Alert key={i} variant={"danger"}>
                                {t.msg} {t.domanda}
                                </Alert>)}
                              <ContentList key={myDomande.length} questionList={myDomande}  SpostaElementi={SpostaElementi} setRisposteGlobali={setRisposteGlobali} bloccaRisposte={!submitButton} />
                              <Row className="justify-content-md-center pt-3"  id="tasti">
                              <Col md="auto">
                              { showCompila &&  <Button key={"compila"}variant="success" onClick={()=>{setGlobalUser(s=>!s); setShowCompila(false)}}>Compila</Button> }
                              { submitButton && <Button key={"invia"}variant="danger"onClick={()=>verificaRisposte(setShowCompila)}>Invia </Button>}
                              </Col>
                              </Row>
  
                              </>}
        { !loggedIn && mode==='view' && <>
        <h2 className="pb-3">{questionarioselezionato.titolo} <small className="text-muted"></small>
                                </h2>

                              <ContentList key={myDomande.length} questionList={myDomande}  SpostaElementi={SpostaElementi} setRisposteGlobali={setRisposteGlobali} bloccaRisposte={!submitButton} />
                              <Row className="justify-content-md-center pt-3"  id="tasti">
                              <Col md="auto">
                              { showCompila &&  <Button key={"compila"}variant="success" onClick={()=>{setGlobalUser(s=>!s); setShowCompila(false)}}>Compila</Button> }
                              { submitButton && <Button key={"invia"}variant="danger"onClick={()=>verificaRisposte(setShowCompila)}>Invia </Button>}
                              </Col>
                              </Row>  
                            </>  }
        { loggedIn && mode==='view' && <>
        <h2 className="pb-3">{questionarioselezionato.titolo}  <small className="text-muted">{(idUtente!==null&&lunghezzautenti>=1)?utentiSelezionati[idUtente].nome:null}
        { idUtente!==null&&lunghezzautenti >1 && idUtente !== 0 &&  <Button variant="primary" size="sm" onClick={()=>decrementaIdUtente()}>  <ArrowLeft></ArrowLeft>
    </Button>}
          { idUtente!==null&&lunghezzautenti >1 && idUtente !== (lunghezzautenti-1) &&  <Button variant="primary" size="sm" onClick={()=>incrementeIdUtente()}>  <ArrowRight></ArrowRight>
    </Button>} 
    
    </small>
                                </h2>

                              <ContentList key={myDomande.length} questionList={myDomande}  SpostaElementi={SpostaElementi} setRisposteGlobali={setRisposteGlobali} bloccaRisposte={!submitButton} utentiSelezionati={utentiSelezionati} lunghezzautenti={lunghezzautenti} loggedIn={loggedIn} idUtente={idUtente}/>
                              <Row className="justify-content-md-center pt-3"  id="tasti">
                              <Col md="auto">
                              { showCompila &&  <Button key={"compila"}variant="success" onClick={()=>{setGlobalUser(s=>!s); setShowCompila(false)}}>Compila</Button> }
                              { submitButton && <Button key={"invia"}variant="danger"onClick={()=>verificaRisposte(setShowCompila)}>Invia </Button>}
                              </Col>
                              </Row>  
                            </>  }
        {mode ==="create" && <FormPersonale chiudiQuestionario={chiudiQuestionario} compilaQuestionario={compilaQuestionario}/> }
        {mode === "compila" && <><h3 className="pb-3">Questionario: <span className="text-muted">{questionari[idQuestionari].titolo}</span>
        </h3>
        
        </>}
        {modo === "aperta" && showDomanda && <DomandaAperta did={did} aggiungiDomanda={aggiungiDomanda} Qid={questionari[idQuestionari].qid}/>}
        {modo === "chiusa" && showDomanda && <DomandaChiusa did={did} aggiungiDomanda={aggiungiDomanda} Qid={questionari[idQuestionari].qid}/>}
        {modo === "temp" && !showDomanda && <ContentList  questionList={domande}   SpostaElementi={SpostaElementi} CancellaDomanda={CancellaDomanda} />}
        {/*<ContentList  questionList={domande}  SpostaElementi={SpostaElementi}  />*/}
     </Col>
     </>);
    
  

}
export default App;
