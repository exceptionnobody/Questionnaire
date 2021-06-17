import { React, useState, useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import API from './API/API'
import { Container, Row, Col, Button, Alert } from 'react-bootstrap/';
import ContentList from './components/ContentList'
import Navigation from './components/Navigation';
import Filters from './components/Filter'
import FormPersonale from './components/FormPersonale';
import DomandeMenu from './components/DomandeMenu';
import DomandaAperta from './components/DomandaAperta';
import {LoginForm} from './components/LoginForm'
import DomandaChiusa from './components/DomandaChiusa';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {

  const [mode, setMode]=useState('precarica')
  const [idQuestionari, setIdQuestionari] = useState(0)
  const [questionari, setQuestionari] =useState([])
  const [questionarioselezionato, setQuestionarioselezionato] = useState({});
  const [contaDomande, setContaDomande] = useState(0)
  const [loading, setLoading] = useState(true);
  const [domande, setDomande] = useState([])
  const [visualizzaDomande, setVisualizzaDomande] = useState([])
  const [adminId] = useState(null)
  const [message, setMessage] = useState({msg:null});
  const [globalUser, setGlobalUser] = useState(false)
  const [submitButton, setSubimitButton] = useState(false)
  const [risposteGlobali, setRisposteGlobali] = useState([])
  const [utilizzatore, setUtilizzatore] = useState(null)

  const aggiungiQuestionario = ()=>{
      setMode('create');
  }

const verificaRisposte = async (funzione)=>{
  const contaObbligatorie = visualizzaDomande.filter(t => t.obbligatoria===1)
  const numobbligatorie = contaObbligatorie.length
  const risposteattese = visualizzaDomande.filter(q => q.obbligatoria===1).map(t=> t.min).reduce((sum, value) => sum+value,0)
  let numeroRisposteTotali=0;
  const array = new Array(numobbligatorie).fill(0);
  console.log(contaObbligatorie)
  for(let i=0; i<numobbligatorie; i++){
  for(const k of risposteGlobali){
    if(k.domanda === contaObbligatorie[i].did && k.numrisposte >= contaObbligatorie[i].min && k.numrisposte <= contaObbligatorie[i].max){
      numeroRisposteTotali += k.numrisposte;
      array[i]=1;
    }
    }
  }
  if(numeroRisposteTotali >= risposteattese){
    console.log("posso inviare il questionari")
    for(const v of risposteGlobali){
      const temp = {...v}
      temp.user = utilizzatore.id
      await  API.inserisciRisposta(temp)
    }
     setSubimitButton(false)
    setMessage({msg: null})
    funzione(true)
  }else{
    console.log("Questionario non valido")
    let errore = []
    for(let i =0; i< numobbligatorie; i++){
      if(array[i]===0){
        errore.push({msg: "Rispetta i vincoli della domanda: ", domanda: visualizzaDomande[i].quesito})
      }
    }
    setMessage(errore)
  }
}


const registraUser = (user) => {
  const TempUser = {
    utente: user,
    questionario: questionarioselezionato.qid
  }

 
  API.inserisciUtente(TempUser).then(uid=> {TempUser.id=uid; setUtilizzatore({...TempUser}); setSubimitButton(true)})
  console.log(utilizzatore) 
  
}



  const chiudiQuestionario = () =>{
    setMode('view');
  }

  const compilaQuestionario = (nameq) => {
      const questionariovett = [...questionari]

      questionariovett[idQuestionari] = {qid: idQuestionari , titolo: nameq, admin:adminId, numdomande:0, numutenti:0}

      API.inserisciUnNuovoQuestionario(questionariovett[idQuestionari]).then(result => {
        questionariovett[idQuestionari].qid = result;
        
     console.log("QID nuovo questionario: "+ questionariovett[idQuestionari].qid)
     console.log(questionariovett[idQuestionari])
        setQuestionari(questionariovett) 
        setMode('compila')
      }      
        )
      
  }
 
  const aggiungiDomandeQuestionario = (domandeQuestionarioProv)=>{
    setIdQuestionari(s => s+1)
    const tempQuestionario = [...questionari]
    tempQuestionario[idQuestionari].domande = domandeQuestionarioProv
    tempQuestionario[idQuestionari].numdomande = domandeQuestionarioProv.length
    setQuestionari(tempQuestionario)
    //console.log(tempQuestionario)
    
    for(const vv of domandeQuestionarioProv){
      
      if(vv.tipo === 0)
           API.inserisciUnNuovaDomandaAperta(vv).then(did=> {vv.did=did; })
       else
           API.inserisciUnNuovaDomandaChiusa(vv).then(did=> {vv.did=did;})
      }
      console.log(tempQuestionario)
      setQuestionari(tempQuestionario)
      setContaDomande(s => s+domandeQuestionarioProv.length)  
      setMode('view')
  } 

  const filtraQuestionario = (id) => {

    setQuestionarioselezionato(questionari[id])
    console.log("QID Questionario selezionato "+questionari[id].qid)
    setVisualizzaDomande(domande.filter(d => d.questionario === questionari[id].qid))
  }

  useEffect(() => {

    async function caricaQuestionari() {

      const result = API.ottieniMieiQuestionari(adminId)
      
      return result
           
    }

    if (loading) {

      caricaQuestionari().then((result) => { 
        
       console.log(result) 
       setQuestionari(result);
       setIdQuestionari(result.length-1); 
        setLoading(false) 
        setMode('view') 
      })

    }

  }, [loading, adminId])

  useEffect(() => {

    async function caricaDomande() {

      const result = API.ottieniDomande(adminId)
      
      return result
    }
      
    if (questionari.length || contaDomande) {
      caricaDomande().then(result => {

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
        console.log(result)


        setDomande(result); 
        setContaDomande(result.length)
      })
    }

  }, [questionari.length, contaDomande, adminId])

  return (

    <Container fluid>
      <Router>
      <Navigation setGlobalUser={setGlobalUser} globalUser={globalUser} registraUser={registraUser}/>
      <Switch>
      <Route exact path="/">
      <Row className="vh-100">

      <QuestionarioManager 
      submitButton={submitButton} setRisposteGlobali={setRisposteGlobali} verificaRisposte={verificaRisposte}
      contaDomande={contaDomande} myDomande={visualizzaDomande} setGlobalUser={setGlobalUser} message={message}
      questionari={questionari} setQuestionari={setQuestionari}  setMode={setMode} aggiungiDomandeQuestionario={aggiungiDomandeQuestionario}
      questionarioselezionato={questionarioselezionato} filtraQuestionario={filtraQuestionario}
      mode={mode} idQuestionari={idQuestionari} chiudiQuestionario={chiudiQuestionario} compilaQuestionario={compilaQuestionario} >


      </QuestionarioManager>
      </Row>
      </Route>

      <Route path="/login">
      
      <LoginForm message={message}>
      {mode === "view" && <Button variant="success" size="lg" className="fixed-right-bottom" onClick={aggiungiQuestionario}>+</Button>}
      {mode === "create" && <Button variant="success" size="lg" className="fixed-right-bottom btn btn-lg btn-danger" onClick={chiudiQuestionario}>X</Button>}
      </LoginForm>

      </Route>

      </Switch>
      </Router>
      </Container>

  );
}

const QuestionarioManager = (props) => {

  const {mode, contaDomande, filtraQuestionario, myDomande, idQuestionari, chiudiQuestionario, compilaQuestionario, questionari,  aggiungiDomandeQuestionario, questionarioselezionato } = props;
  const {setGlobalUser, submitButton, setRisposteGlobali, verificaRisposte, message } = props
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
    'D3': { label: "Pubblica Questionario", id: 'd3', fnc: pubblicaQuestionario}
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
          {mode === 'view' && <Filters items={questionari} filtraQuestionario={filtraQuestionario} setShowCompila={setShowCompila}/>}
          {mode === 'compila' && <DomandeMenu items={opzioneDomande} aggiungiDomanda={aggiungiDomanda} />}
        </Col>      
      <Col xs={9} className="below-nav" id="main" key={"main"} >
        {mode ==="view" && <><h2 className="pb-3">{questionarioselezionato.titolo} <small className="text-muted"></small>
                                </h2>
                                {message.msg!==null && message.map((t,i) =>  <Alert key={i} variant={"danger"}>
    {t.msg} {t.domanda}
  </Alert>)}
                              <ContentList key={myDomande.length} questionList={myDomande}  SpostaElementi={SpostaElementi} setRisposteGlobali={setRisposteGlobali} />
                              <Row className="justify-content-md-center pt-3"  id="tasti">
                              <Col md="auto">
                              { showCompila &&  <Button key={"compila"}variant="success" onClick={()=>{setGlobalUser(s=>!s); setShowCompila(false)}}>Compila</Button> }
                              { submitButton && <Button key={"invia"}variant="danger"onClick={()=>verificaRisposte(setShowCompila)}>Invia </Button>}
                              </Col>
                              </Row>
  
                              </>}
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
