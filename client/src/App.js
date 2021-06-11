import { React, useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';

import { Container, Row, Col, Button } from 'react-bootstrap/';
import ContentList from './components/ContentList'
import Navigation from './components/Navigation';
import Filters from './components/Filter'
import ModalForm  from './components/ModalForm';
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
  const MODAL = { CLOSED: -2, ADD: -1 };
  const [setModal, setModalClosed] = useState(MODAL.CLOSED);
  const [questionari, setQuestionari] =useState([])
  const [idQuestionario, setIdQuestionario] =useState(0);

  const handleClose = () => {
    setModalClosed(MODAL.CLOSED);
  }


  const aggiungiQuestionario = ()=>{
      setMode('create');
  }

  const chiudiQuestionario = () =>{
    setMode('view');
  }

  const compilaQuestionario = (name) => {
      const questionariovett = [...questionari]

      questionariovett.push({titolo:name, qid:idQuestionario, aid:0})
      setMode('compila')
      setQuestionari(questionariovett)
      //setIdQuestionario(d=>d+1)
  }

  const handleSaveOrUpdate = ()=>{

  }
  return (

    <Container fluid>
      <Navigation aggiungiQuestionario={aggiungiQuestionario} chiudiQuestionario={chiudiQuestionario}/>
      <Row className="vh-100">
      <QuestionarioManager questionari={questionari} setQuestionari={setQuestionari} idQuestionario={idQuestionario}
      questionList={questionList} mode={mode} chiudiQuestionario={chiudiQuestionario} compilaQuestionario={compilaQuestionario} >


      </QuestionarioManager>
      {/*{mode === "compila" && <Button variant="success" size="lg" className="fixed-right-bottom" onClick={() => setModalClosed(MODAL.ADD)}>+</Button>}
      {(setModal !== MODAL.CLOSED) && <ModalForm task={{}} onSave={handleSaveOrUpdate} onClose={handleClose}></ModalForm>}*/}
      </Row>
      
      </Container>

  );
}

const QuestionarioManager = (props) => {

  const {mode, chiudiQuestionario, compilaQuestionario, questionari, idQuestionario } = props;

  const [ domande, setDomande] = useState([])
  //const [ domande, setDomande] = useState([...questionList])
  const [ showDomanda, setShowDomanda] = useState()
  const [did, setDid] = useState(0);
  const [modo, setModo] = useState('')
  const filters = {
    'Q1': { label: 'Q1', id: 'q1'},
    'Q2': { label: 'Q2', id: 'q2'},
    'Q3': { label: 'Q3', id: 'q3' }
  };

  const pubblicaQuestionario= () =>{
    console.log("test")
    if(!domande.length)
      console.log("Inserire delle domande")
  }

  const opzioneDomande = {
    'D1': { label: 'Aggiungi Domanda Chiusa', id: 'd1', fnc: ()=>{setShowDomanda(true); setModo("chiusa")}},
    'D2': { label: 'Aggiungi Domanda Aperta', id: 'd2', fnc: ()=>{setShowDomanda(true); setModo("aperta")}},
    'D3': { label: "Pubblica Questionario", id: 'd3', fnc: pubblicaQuestionario}
  };


  const aggiungiDomandaAperta = (domanda) =>{
        setDomande(s => [...s, domanda]);
        setShowDomanda(false);
        setModo("temp")
        setDid(d => d+1)
  }

  const aggiungiDomandaChiusa = (domanda) =>{
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
    console.log(arr)
    setDomande(arr)
    //return nums;
  }


  return (<>
        <Col xs={3} bg="light" className="below-nav" id="left-sidebar">
          {mode === 'view' && <Filters items={filters} />}
          {mode === 'compila' && <DomandeMenu items={opzioneDomande} aggiungiDomandaAperta={aggiungiDomandaAperta} aggiungiDomandaChiusa={aggiungiDomandaChiusa}/>}
        </Col>      
      <Col xs={9} className="below-nav">
        {mode ==="view" && <h2 className="pb-3">Filter: <small className="text-muted">Test</small></h2>}
        {mode ==="create" && <FormPersonale chiudiQuestionario={chiudiQuestionario} compilaQuestionario={compilaQuestionario}/> }
        {mode === "compila" && <h2 className="pb-3">Questionario: <small className="text-muted">{questionari[idQuestionario].titolo}</small></h2>}
        {modo === "aperta" && showDomanda && <DomandaAperta did={did} aggiungiDomandaAperta={aggiungiDomandaAperta}/>}
        {modo === "chiusa" && showDomanda && <DomandaChiusa did={did} aggiungiDomandaChiusa={aggiungiDomandaChiusa} />}
        {modo === "temp" && !showDomanda && <ContentList  questionList={domande}   SpostaElementi={SpostaElementi} />}
        <ContentList  questionList={domande}  SpostaElementi={SpostaElementi}  />
     </Col>
     </>);
    
  

}
export default App;
