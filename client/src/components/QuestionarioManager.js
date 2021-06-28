import React, { useState } from 'react'
import { ArrowRight, ArrowLeft } from 'react-bootstrap-icons';
import ContentList from './ContentList';
import Filters from './Filter'
import FormPersonale from './FormPersonale';
import DomandeMenu from './DomandeMenu';
import DomandaAperta from './DomandaAperta';
import DomandaChiusa from './DomandaChiusa';
import { Row, Col, Button, Alert } from 'react-bootstrap/';


const QuestionarioManager = (props) => {

    const { mode, contaDomande, filtraQuestionario, myDomande, idQuestionari, compilaQuestionario, questionari, aggiungiDomandeQuestionario, questionarioselezionato, cancellaQuestionario, bloccaFiltri, setBloccaFiltri } = props;
    const { setGlobalUser, submitButton, setRisposteGlobali, verificaRisposte, message, loggedIn, utentiSelezionati, lunghezzautenti, idUtente, incrementeIdUtente, decrementaIdUtente, setRicaricaUtenti2, setMessage } = props

    const [domande, setDomande] = useState([])
    const [showDomanda, setShowDomanda] = useState()
    const [did, setDid] = useState(0);
    const [modo, setModo] = useState('')
    const [showCompila, setShowCompila] = useState(false)
    const [errore, setErrore] = useState({ messsage: null })
    const [show, setShow] = useState(false);

    const pubblicaQuestionario = () => {
        let newId;
        if (domande.length >= 1 && domande.filter(d => d.obbligatoria === 1).length >= 1) {

            const tempDomande = [...domande]

            newId = contaDomande;
            for (const v of tempDomande) {
                v.modificabile = false
                if (v.qid !== 0) {
                    v.did = newId;
                    newId++;
                }
            }

            setDid(0)
            setModo('view')
            aggiungiDomandeQuestionario(tempDomande)
            setDomande([])
            setBloccaFiltri(false)
        } else {
            setShow(true)
            setErrore({ messsage: "Il questionario NON deve essere vuoto e deve avere ALMENO una domanda obbligatoria." })
        }

    }

    const opzioneDomande = {
        'D1': { label: 'Aggiungi Domanda Chiusa', id: 'd1', fnc: () => { setShowDomanda(true); setModo("chiusa") } },
        'D2': { label: 'Aggiungi Domanda Aperta', id: 'd2', fnc: () => { setShowDomanda(true); setModo("aperta") } },
        'D3': { label: "Pubblica Questionario", id: 'd3', fnc: pubblicaQuestionario },
        'D4': { label: "Cancella Questionario", id: "d4", fnc: () => { cancellaQuestionario(); setDomande([]); setDid(0) } }
    };


    const aggiungiDomanda = (domanda) => {
        setDomande(s => [...s, domanda]);
        setShowDomanda(false);
        setModo("temp")
        setDid(d => d + 1)
    }

    const SpostaElementi = function (old_index, new_index) {
        let arr = [...domande];
        const val1 = { ...domande[old_index] };
        const val2 = { ...domande[new_index] }

        arr[old_index] = arr[new_index]
        arr[new_index] = val1

        arr[old_index].did = val1.did
        arr[new_index].did = val2.did
        setDomande(arr)
    }


    const CancellaDomanda = (index) => {

        const tempDomande = domande.filter(t => t.did !== index);
        if (tempDomande.length !== 0) {
            let i = 0;
            for (const v of tempDomande) {
                v.did = i;
                i++;
            }
            setDid(i)
            setDomande(tempDomande)
        } else {
            setDid(0);
            setDomande([])
        }
    }

    return (<>
        {/* BARRA LATERALE FILTRI E MENU PER ADMIN*/}
        <Col xs={3} bg="light" className="below-nav" id="left-sidebar" key={"filtri"}>

            {(mode === 'view' || mode === "compilaUtente") && <Filters items={questionari} filtraQuestionario={filtraQuestionario} setShowCompila={setShowCompila} loggedIn={loggedIn} setRicaricaUtenti2={setRicaricaUtenti2} bloccaFiltri={bloccaFiltri} />}

            {mode === 'compila' && loggedIn && <DomandeMenu items={opzioneDomande} aggiungiDomanda={aggiungiDomanda} />}

        </Col>

        {/* MAIN */}
        <Col xs={9} className="below-nav" id="main" key={"main"} >

            {/* COMPILAZIONE DEL QUESTIONARIO DA PARTE DELL'UTILIZZATORE */}
            {!loggedIn && mode === "compilaUtente" && <>
                <h2 className="pb-3">{questionarioselezionato.titolo} <small className="text-muted"></small>
                </h2>
                {message.msg !== null && <Alert variant="danger" onClose={() => setMessage({ msg: null })} dismissible>
                    <Alert.Heading>Errore nella pubblicazione del questionario:</Alert.Heading>
                    {message.map((t, i) => <Alert key={i} variant={"danger"}>
                        {t.msg} {t.domanda}
                    </Alert>)}
                </Alert>}
                <ContentList  questionList={myDomande} setRisposteGlobali={setRisposteGlobali} bloccaRisposte={!submitButton} />
                <Row className="justify-content-md-center pt-3" id="tasti">
                    <Col md="auto">
                        {submitButton && <Button key={"invia"} variant="danger" onClick={() => verificaRisposte(setShowCompila)}>Invia </Button>}
                    </Col>
                </Row>

            </>}

            {/* VISUALIZZAZIONE DEI QUESTIONARI DA PARTE DELL'UTILIZZATORE */}
            {!loggedIn && mode === 'view' && <>
                <h2 className="pb-3">{questionarioselezionato.titolo}  </h2>

                <ContentList  questionList={myDomande}  bloccaRisposte={!submitButton} mode={mode} />
               
                <Row className="justify-content-md-center pt-3" id="tasti" key={"compilabutton"}>
                    <Col md="auto">
                        {showCompila && <Button key={"compila"} variant="success" onClick={() => { setGlobalUser(s => !s); setShowCompila(false); setBloccaFiltri(true) }}>Compila</Button>}
                    </Col>
                </Row>
            </>}

            {/* VISUALIZZAZIONE ADMIN DEI QUESTIONARI CON LE RISPOSTE DEGLI UTENTI */}
            {loggedIn && mode === 'view' && <>
                <h2 className="pb-3" key={questionarioselezionato.titolo}>{questionarioselezionato.titolo}  <small className="text-muted" key={lunghezzautenti}>{(idUtente !== null && lunghezzautenti >= 1) ? utentiSelezionati[idUtente].nome : null}
                    {idUtente !== null && lunghezzautenti > 1 && idUtente !== 0 && <Button  variant="primary" size="sm" onClick={() => decrementaIdUtente()}>  <ArrowLeft></ArrowLeft>
                    </Button>}
                    {idUtente !== null && lunghezzautenti > 1 && idUtente !== (lunghezzautenti - 1) && <Button variant="primary" size="sm" onClick={() => incrementeIdUtente()}>  <ArrowRight></ArrowRight>
                    </Button>}

                </small>
                </h2>

                <ContentList questionList={myDomande} setRisposteGlobali={setRisposteGlobali} bloccaRisposte={!submitButton} utentiSelezionati={utentiSelezionati} lunghezzautenti={lunghezzautenti} loggedIn={loggedIn} idUtente={idUtente} mode={mode} />
            </>}


            {/* CREA QUESTIONARIO */}
            {mode === "create" && <FormPersonale compilaQuestionario={compilaQuestionario} />}

            
            {/* VISUALIZZA IL QUESTIONARIO CREATO CON LE DOMANDE MA ANCORA NON PUBBLICATO */}
            {mode === "compila" && <><h3 className="pb-3">Questionario: <span className="text-muted">{questionari[idQuestionari].titolo}</span></h3></>}
            
            {/* APRE FORM PER DOMANDA APERTA O CHIUSA */}
            {modo === "aperta" && showDomanda && <DomandaAperta did={did} aggiungiDomanda={aggiungiDomanda} Qid={questionari[idQuestionari].qid} />}
            {modo === "chiusa" && showDomanda && <DomandaChiusa did={did} aggiungiDomanda={aggiungiDomanda} Qid={questionari[idQuestionari].qid} />}



            {modo === "temp" && !showDomanda && <>

                {show && <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                    <Alert.Heading>Errore nella pubblicazione del questionario:</Alert.Heading>
                    {errore.messsage}

                </Alert>}
                <ContentList questionList={domande} SpostaElementi={SpostaElementi} CancellaDomanda={CancellaDomanda} bloccaRisposte={!submitButton} loggedIn={loggedIn} mode={mode} />
            </>}

        </Col>
    </>);



}

export { QuestionarioManager };