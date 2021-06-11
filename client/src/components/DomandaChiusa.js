import React, { useState } from 'react'
import {Accordion, Card, Form, Button, Col, Row} from 'react-bootstrap'

const DomandaChiusa = (props)=>{

    const [min, setMin] = useState(undefined); 
    const [max, setMax] = useState(undefined);
    const [numOpzioni, setNumOpzioni] = useState(0); 
    const [quesito, setQuesito] = useState('')

    const [opzioni, setOpzioni] = useState([]);

    const testopzioni =[]
    const sottometti=(event)=>{
        event.preventDefault();
         const domanda = {did: props.did, quesito: quesito, min: min, max:max, numopzioni: numOpzioni, tipo:1,domandachiusa:testopzioni.map(t=>t) , temporaneo: 0}
        props.aggiungiDomandaChiusa(domanda);
    }

    const setStateOpzion = (valore, ind) =>{
        
        testopzioni[ind]= {opzione:valore};
        console.log(testopzioni)
    }
return <Accordion defaultActiveKey="0">
  <Card>
    <Accordion.Toggle as={Card.Header} eventKey="0">
    <span>Domanda Chiusa</span>
    </Accordion.Toggle>

    <Accordion.Collapse eventKey="0">
      <Card.Body>
          <Form onSubmit={sottometti}>
  <Form.Row>
  <Form.Group as={Col} controlId="formGridEmail">
      <Form.Label>Quesito</Form.Label>
      <Form.Control placeholder="Inserisci Quesito" onChange={(ev) => setQuesito(ev.target.value)} required/>
    </Form.Group>
  <Form.Group as={Col} controlId="formGridState">
      <Form.Label>Numero di Opzioni</Form.Label>
      <Form.Control value={undefined}as="select" defaultValue="Choose..." onChange={(ev)=>{
          
          let vett = []
          setNumOpzioni(ev.target.value)
        for(let i=0; i<ev.target.value; i++){
            vett.push({opzione: ""})
        }
        console.log(vett)
        setOpzioni(vett)

        }
    
    } required>
        <option> </option>
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>10</option>
      </Form.Control>
    </Form.Group>
    <Form.Group as={Col} controlId="formGridState">
      <Form.Label>Min</Form.Label>
      <Form.Control as="select" defaultValue="Choose..." onChange={(ev)=>setMin(ev.target.value)}>
        <option>1</option>
        <option>2</option>
        <option>3</option>
      </Form.Control>
    </Form.Group>
    <Form.Group as={Col} controlId="formGridState">
      <Form.Label>Max</Form.Label>
      <Form.Control as="select" defaultValue="Choose..." onChange={(ev)=>setMax(ev.target.value)}>
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>10</option>
      </Form.Control>
    </Form.Group>
    </Form.Row>
    <Form.Row>  
{ opzioni!==null && opzioni.map((t, i) => {
    return <Row key={i} className="align-items-center">
    <Col xs="auto">
      <Form.Label htmlFor="inlineFormInput" visuallyhidden="true">
        Quesito {`${i}`}
      </Form.Label>
      <Form.Control
        className="mb-2"
        id={i}
        placeholder="Jane Doe"
        onChange={(ev)=>{setStateOpzion(ev.target.value, i)}}
      />
    </Col>

  </Row>

})  
}
</Form.Row>
  <Button variant="primary" type="submit">
    Inserisci
  </Button>
</Form></Card.Body>
    </Accordion.Collapse>
  </Card>

</Accordion>
}
export default DomandaChiusa;