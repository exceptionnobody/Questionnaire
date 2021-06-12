import React, { useState } from 'react'
import {Accordion, Card, Form, Button, Col} from 'react-bootstrap'

const DomandaAperta = (props)=>{
    const {idQuestionario} = props
    const [obbligatoria, setObbligatoria] = useState(false); 
    const [quesito, setQuesito] = useState('')
    

    const sottometti=(event)=>{
        event.preventDefault();
        let min, max;
        if(obbligatoria)
            min=max=1;
        else
            min=max=0;

        const domanda = {did: props.did, qid: idQuestionario, modificabile:true, quesito: quesito, min: min, max:max, numopzioni: 1, tipo:0, opzioneaperta: "OPTAPERTA" , temporaneo: 1}
        props.aggiungiDomandaAperta(domanda);
    }
return <Accordion defaultActiveKey="0">
  <Card>
    <Accordion.Toggle as={Card.Header} eventKey="0">
      Domanda Aperta
    </Accordion.Toggle>
    <Accordion.Collapse eventKey="0">
      <Card.Body>
          <Form onSubmit={sottometti}>
  <Form.Row>
    <Form.Group as={Col} controlid="formGridEmail">
      <Form.Label>Quesito</Form.Label>
      <Form.Control placeholder="Inserisci Quesito" onChange={(ev) => setQuesito(ev.target.value)} required/>
    </Form.Group>
  </Form.Row>

  <Form.Group id="formGridCheckbox">
    <Form.Check type="checkbox" label="Domanda Obbligatoria" onChange={(ev)=>setObbligatoria(ev.target.checked)}/>
  </Form.Group>

  <Button variant="primary" type="submit">
    Inserisci
  </Button>
</Form></Card.Body>
    </Accordion.Collapse>
  </Card>

</Accordion>
}
export default DomandaAperta;