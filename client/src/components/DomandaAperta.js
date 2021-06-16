import React, { useState } from 'react'
import {Accordion, Card, Form, Button, Col} from 'react-bootstrap'

const DomandaAperta = (props)=>{
    const {Qid} = props
    const [obbligatoria, setObbligatoria] = useState(false); 
    const [quesito, setQuesito] = useState('')
    

    const sottometti=(event)=>{
        event.preventDefault();
        let min, max;
        let domanda = {}
        if(obbligatoria){
            min=max=1;
            domanda.obbligatoria = 1;
        }else{
            min=0;
            max=1;
            domanda.obbligatoria = 0;
        }

        domanda = {did: props.did, qid: Qid, modificabile:true, quesito: quesito, min: min, max:max, numopzioni: 1, tipo:0, ...domanda }
        props.aggiungiDomanda(domanda);
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
    <Form.Group as={Col}>
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