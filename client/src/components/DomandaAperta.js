import React, { useState } from 'react'
import { Card, Form, Button, Col } from 'react-bootstrap'

const DomandaAperta = (props) => {
 
  const { Qid } = props
  const [obbligatoria, setObbligatoria] = useState(false);
  const [quesito, setQuesito] = useState('')


  const sottometti = (event) => {
    
    event.preventDefault();

    const domanda = { did: props.did, qid: Qid, modificabile: true, quesito: quesito, min: obbligatoria ? 1 : 0, max: 1, numopzioni: 1, tipo: 0, obbligatoria: obbligatoria ? 1 : 0 }
    
    props.aggiungiDomanda(domanda);
  }

  return <Card>
    <Card.Header as="h5">Domanda Aperta</Card.Header>
    <Card.Body>
      <Form onSubmit={sottometti}>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Quesito</Form.Label>
            <Form.Control placeholder="Inserisci Quesito" onChange={(ev) => setQuesito(ev.target.value)} required />
          </Form.Group>
        </Form.Row>

        <Form.Group id="formGridCheckbox">
          <Form.Check type="checkbox" label="Domanda Obbligatoria" onChange={(event) => { setObbligatoria(event.target.checked)}} />
        </Form.Group>

        <Button variant="primary" type="submit">
          Inserisci
        </Button>
      </Form>
    </Card.Body>

  </Card>

}
export default DomandaAperta;