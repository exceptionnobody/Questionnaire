import React, { useState } from 'react'
import { Form, ListGroup, Button, Badge } from 'react-bootstrap/';
import { Trash, ArrowDown, ArrowUp } from 'react-bootstrap-icons';


const OptionData = (props) => {
  const { optionsList } = props;

  return (<div className="flex-fill m-auto">
    <span key={"tipo"+optionsList.tipo}><small>{optionsList.tipo ? "Domanda Chiusa" : "Domanda Aperta"} {optionsList.obbligatoria === 1 && <Badge variant="danger">Obbligatoria</Badge>}</small>
      {optionsList.tipo === 1 ? <span>   Min: {optionsList.min} - Max: {optionsList.max}</span> : <small><Badge variant="warning">Max 200 caratteri</Badge></small>}
    </span>
    <h4> {optionsList.quesito} </h4>

  </div>
  )
}

const StampaOpzioni = (props) => {
  const { opzioni, optionsList, gestisciRisposte, bloccaRisposte} = props;
  return  <div className="mb-3">
      {opzioni.map((t, i) => {
        return <Form.Check key={t.opzione} type="checkbox" disabled={!!bloccaRisposte} onClick={(event) => gestisciRisposte(event.target.checked, i, optionsList)} label={t.opzione} />
      })
      }
    </div>

}



const AnswerControls = (props) => {
  const { SpostaElementi, domanda, lunghezzadomande, CancellaDomanda } = props;
  return (
    <>
      <div className="flex-fill m-auto" key={"modificabile"+ domanda.did}>
        {lunghezzadomande > 1 && domanda.did !== (lunghezzadomande - 1) && <Button size="sm" variant="danger" className="shadow-none" onClick={() => SpostaElementi(domanda.did, domanda.did + 1)}> <ArrowDown /></Button>}
        {lunghezzadomande > 1 && domanda.did !== 0 && <Button size="sm" variant="danger" className="shadow-none" onClick={() => SpostaElementi(domanda.did, domanda.did - 1)}><ArrowUp /></Button>}
        <Button size="sm" variant="danger" className="shadow-none" onClick={() => CancellaDomanda(domanda.did)} ><Trash /></Button>
      </div>
    </>
  )
}


const ContentList = (props) => {

  const { mode, questionList, SpostaElementi, CancellaDomanda, setRisposteGlobali, utentiSelezionati, loggedIn, lunghezzautenti, idUtente } = props;

  const [risposte, setRisposte] = useState(questionList.length !== 0 ? questionList.map(d => {
    return {
      domanda: d.did,
      numrisposte: 0,
      tipo: d.tipo,
      obbligatoria: d.obbligatoria,
    }
  }) : null)

  const gestisciRisposte = (value, id, domanda) => {
    const temp = [...risposte];

    if (domanda.tipo === 0 && value.length <= 200) {
      for (const z of temp) {
        if (z.domanda === id) {
          z.numrisposte = 1
          z.opzioneaperta = value
        }
      }

    } else {
      let rispostaData;
      for (const v of temp) {
        if (v.domanda === domanda.did && value) {
          rispostaData = `opzione${id + 1}`
          v[rispostaData] = 1;
          v.numrisposte++;
        }
        if (v.domanda === domanda.did && !value) {
          rispostaData = `opzione${id + 1}`
          v[rispostaData] = 0;
          v.numrisposte--;
        }
      }
    }
    setRisposte([...temp])
    setRisposteGlobali([...temp])
  }

  return (
    <>{ questionList.length ?
      <ListGroup as="div" variant="flush" key={"listgroup"}>
           {questionList.map((t,u) => {
            const tipodomanda = (t.tipo === 1 && t.numopzioni >= 1) ? true : false;

            return (<div key={t.did}>
    <ListGroup.Item as="li" key={u} className={`d-flex w-100  ${t.tipo ? "bg-warning" : "bg-info"}`}  >
                <OptionData optionsList={t} key={t.quesito}/>
                {loggedIn && t.modificabile && <AnswerControls key={"controlbuttons"} domanda={t} lunghezzadomande={questionList.length} SpostaElementi={SpostaElementi} CancellaDomanda={CancellaDomanda} />}
              </ListGroup.Item>

              {/* VISUALIZZO LE DOMANDE CON LE OPZIONI IN FASE DI COMPILAZIONE */}
              {mode === 'compila' && loggedIn && tipodomanda && <StampaOpzioni  optionsList={t} opzioni={t.opzioni} numopzioni={t.numopzioni} gestisciRisposte={null} bloccaRisposte={props.bloccaRisposte}>    </StampaOpzioni>  }
              {mode === 'compila' && loggedIn && !tipodomanda && <>
                <Form className="flex-fill d-flex w-100" >
                  <Form.Control size="lg" as="textarea" rows={2} placeholder="" readOnly/>
                </Form>
              </>}

              {/* VISUALIZZO LE OPZIONI DI OGNI DOMANDA IN MODALITA' UTILIZZATORE*/}
              {!loggedIn && tipodomanda && <StampaOpzioni optionsList={t} opzioni={t.opzioni} numopzioni={t.numopzioni} gestisciRisposte={gestisciRisposte} bloccaRisposte={props.bloccaRisposte}> </StampaOpzioni>}
              {!loggedIn && !tipodomanda && <>
                <Form className="flex-fill d-flex w-100" >
                  <Form.Control size="lg" as="textarea" rows={2} placeholder="Da Compilare..." readOnly={!!props.bloccaRisposte} onChange={(event) => gestisciRisposte(event.target.value, t.did, t)} />
                </Form>
              </>}

              {/* VISUALIZZO LE RISPOSTE SE UN QUESTIONARIO HA DEGLI UTENTI */}
              {mode === 'view' && loggedIn && lunghezzautenti >= 1 && <>

              {utentiSelezionati[idUtente].risposte.filter(f => f.domanda === t.did).map((r) => {

                if (!r.tipo)
                  return  <Form className="flex-fill d-flex w-100" key={r.opzioneaperta ? r.opzioneaperta : "noanswer"}>
                      <Form.Control size="lg" as="textarea"  rows={2} placeholder="Large text" readOnly value={r.opzioneaperta ? r.opzioneaperta : "AVVISO: Risposta NON data"} />
                    </Form>
          
                else {
                  return <Form key={t.quesito}>
                  {r.opzioni.map((o,l) => <Form.Check type="checkbox"  key={o.domanda} label={o.domanda} checked={o.valorerisposta ? true : false} disabled></Form.Check>)}
                  </Form>

              }

              })
              
            }</>}

              {/* VISUALIZZO LE DOMANDE SE UN QUESTIONARIO NON HA DEGLI UTENTI */}
              {loggedIn && mode === 'view' && !lunghezzautenti && tipodomanda && <StampaOpzioni optionsList={t} opzioni={t.opzioni} numopzioni={t.numopzioni} gestisciRisposte={null} bloccaRisposte={props.bloccaRisposte}></StampaOpzioni>}
              {loggedIn && mode === 'view' && !lunghezzautenti &&  !tipodomanda && <>
                <Form className="flex-fill d-flex w-100"  >
                  <Form.Control size="lg" as="textarea" rows={2} placeholder="" readOnly />
                </Form>
              </>}
            </div>);
          })}
          
         
      </ListGroup>
    :null} </>
  )
}

export default ContentList;