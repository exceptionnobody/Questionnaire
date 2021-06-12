import { React, useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';

import { Container, Row, Col, Button } from 'react-bootstrap/';
import ContentList from './components/ContentList'
import Navigation from './components/Navigation';
import Filters from './components/Filter'
import FormPersonale from './components/FormPersonale';
import DomandeMenu from './components/DomandeMenu';
import DomandaAperta from './components/DomandaAperta';
import DomandaChiusa from './components/DomandaChiusa';
//import { BrowserRouter as Router, Route, useParams, useHistory, Switch, Redirect } from 'react-router-dom';

const questionList = [
  { did: 0, quesito: "Domanda 3 Q1 dopp", important: false, private: false, numopzioni:1 ,tipo: 0, opzioneaperta: "OPTAPERTA" },
  { did: 1, quesito: "Domanda 1 Q1", important: false, private: true, min:0, max:1, numopzioni:6, tipo: 1, domandachiusa: [{opzione: "OPT0"},{opzione: "OPT1"}, {opzione: "OPT2"}, {opzione: "OPT3"}, {opzione:"OPT4"},{opzione: "OPT5"}]},
  { did: 2, quesito: "Domanda 2 Q1", important: false, private: true, min:1, max:1, numopzioni:4, tipo: 1, domandachiusa: [{opzione: "OPT5"}, {opzione: "OPT6"}, {opzione: "OPT7"}, {opzione:"OPT8"}]},
  { did: 3, quesito: "Domanda 3 Q1", important: false, private: false, numopzioni:1 ,tipo: 0, opzioneaperta: "OPTAPERTA" },
  { did: 4, quesito: "Domanda 4 Q1", important: true, private: true, numopzioni:1 ,tipo: 0, opzioneaperta: "OPTAPERTA" },

];

function App() {

  const [mode, setMode]=useState('view')
  const [idQuestionari, setIdQuestionari] = useState(0)
  const [questionari, setQuestionari] =useState([])
  const [questionarioselezionato, setQuestionarioselezionato] = useState({});


  const aggiungiQuestionario = ()=>{
      setMode('create');
  }

  const chiudiQuestionario = () =>{
    setMode('view');
  }

  const compilaQuestionario = (name) => {
      const questionariovett = [...questionari]

      questionariovett.push({titolo:name, qid:idQuestionari, aid:0})
      setQuestionari(questionariovett)
      setMode('compila')
  }
 
  const aggiungiDomandeQuestionario = (domandeQuestionarioProv)=>{
    setIdQuestionari(s => s+1)
    const tempQuestionario = [...questionari]
    tempQuestionario[idQuestionari].domande = domandeQuestionarioProv
    tempQuestionario[idQuestionari].numdomande = domandeQuestionarioProv.length
    setQuestionari(tempQuestionario)
    setMode('view')
    
  } 

  const filtraQuestionario = (id) => {

    setQuestionarioselezionato(questionari[id])
  }

  return (

    <Container fluid>
      <Navigation />
      <Row className="vh-100">
      <QuestionarioManager questionari={questionari} setQuestionari={setQuestionari}  setMode={setMode} aggiungiDomandeQuestionario={aggiungiDomandeQuestionario}
      questionList={questionList} questionarioselezionato={questionarioselezionato} filtraQuestionario={filtraQuestionario}
      mode={mode} idQuestionari={idQuestionari} chiudiQuestionario={chiudiQuestionario} compilaQuestionario={compilaQuestionario} >


      </QuestionarioManager>
      {mode === "view" && <Button variant="success" size="lg" className="fixed-right-bottom" onClick={aggiungiQuestionario}>+</Button>}
      {mode === "create" && <Button variant="success" size="lg" className="fixed-right-bottom btn btn-lg btn-danger" onClick={chiudiQuestionario}>X</Button>}
      </Row>
      
      </Container>

  );
}

const QuestionarioManager = (props) => {

  const {mode, filtraQuestionario, idQuestionari, chiudiQuestionario, compilaQuestionario, questionari,  aggiungiDomandeQuestionario, questionarioselezionato } = props;

  const [ domande, setDomande] = useState([])
  //const [ domande, setDomande] = useState([...questionList])
  const [ showDomanda, setShowDomanda] = useState()
  const [did, setDid] = useState(0);
  const [modo, setModo] = useState('')

  const pubblicaQuestionario= () =>{
    console.log("test pubblica Questionario")
    let newId
    if(domande.length >1){

     const tempDomande = [...domande]

     if(idQuestionari !== 0)
        newId = questionari[idQuestionari-1].numdomande;

     for(const v of tempDomande){
       v.modificabile=false
       if(v.qid !== 0){
            v.did = newId
            newId++;
       }
     }


     setDomande([])
     
     setDid(0)
     setModo('view')

     console.log("Prima di Pubblicare le domande e di conseguenza il questionario: ")
     console.log(tempDomande)
     aggiungiDomandeQuestionario(tempDomande)
    }else{

    }

    }

  const opzioneDomande = {
    'D1': { label: 'Aggiungi Domanda Chiusa', id: 'd1', fnc: ()=>{setShowDomanda(true); setModo("chiusa")}},
    'D2': { label: 'Aggiungi Domanda Aperta', id: 'd2', fnc: ()=>{setShowDomanda(true); setModo("aperta")}},
    'D3': { label: "Pubblica Questionario", id: 'd3', fnc: pubblicaQuestionario}
  };


  const aggiungiDomanda = (domanda) =>{
    console.log(domanda)
    console.log(idQuestionari)
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
        <Col xs={3} bg="light" className="below-nav" id="left-sidebar">
          {mode === 'view' && <Filters items={questionari} filtraQuestionario={filtraQuestionario}/>}
          {mode === 'compila' && <DomandeMenu items={opzioneDomande} aggiungiDomanda={aggiungiDomanda} />}
        </Col>      
      <Col xs={9} className="below-nav">
        {mode ==="view" && <><h2 className="pb-3">{questionarioselezionato.titolo} <small className="text-muted"></small></h2>
                              <ContentList  questionList={questionarioselezionato.domande?questionarioselezionato.domande:[]}  SpostaElementi={SpostaElementi}  />
                              </>}
        {mode ==="create" && <FormPersonale chiudiQuestionario={chiudiQuestionario} compilaQuestionario={compilaQuestionario}/> }
        {mode === "compila" && <><h3 className="pb-3">Questionario: <span className="text-muted">{questionari[idQuestionari].titolo}</span>
        </h3>
        
        </>}
        {modo === "aperta" && showDomanda && <DomandaAperta did={did} aggiungiDomanda={aggiungiDomanda} idQuestionario={idQuestionari}/>}
        {modo === "chiusa" && showDomanda && <DomandaChiusa did={did} aggiungiDomanda={aggiungiDomanda} idQuestionario={idQuestionari}/>}
        {modo === "temp" && !showDomanda && <ContentList  questionList={domande}   SpostaElementi={SpostaElementi} CancellaDomanda={CancellaDomanda} />}
        {/*<ContentList  questionList={domande}  SpostaElementi={SpostaElementi}  />*/}
     </Col>
     </>);
    
  

}
export default App;
