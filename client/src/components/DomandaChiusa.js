import React, { useState } from 'react'
import {Accordion, Card, Form, Button, Col, Row} from 'react-bootstrap'

const DomandaChiusa = (props)=>{
    const {idQuestionario} = props
    const [min, setMin] = useState(undefined); 
    const [max, setMax] = useState(undefined);
    const [numOpzioni, setNumOpzioni] = useState(0); 
    const [quesito, setQuesito] = useState('')
    const [opzioni, setOpzioni] = useState([]);

    const sottometti=(event)=>{
        event.preventDefault();
        let opzionei
        let domanda = {};
        for(let i=0; i<numOpzioni; i++){
          opzionei = `opzione${i+1}`
          domanda[opzionei] = opzioni[i].opzione

        }
        
         domanda = {did: props.did, qid:idQuestionario, modificabile:true, quesito: quesito, min: min, max:max, numopzioni: numOpzioni, tipo:1, opzioni: opzioni.map(t=>t), ...domanda}
         setOpzioni([])
         setNumOpzioni(0)
         props.aggiungiDomanda(domanda);
    }

    const registraOpzione = (value, ind) =>{
      setOpzioni(oldstate => {
          const list = oldstate.map((item)=>{
            if(item.indice === ind){
              return { opzione: value, indice: ind}
            }else{
              return item
            }
          })
          return list
        })
    }

    const settoIlNumeroOpzioni = (ev)=>{
      let vett = []
      const numOpzioni = parseInt(ev.target.value);

      setNumOpzioni(numOpzioni)
  
      for(let i=0; i<ev.target.value; i++){
        vett.push({opzione: "", indice:i})
      }
      setOpzioni(vett)

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
  <Form.Group as={Col}>
      <Form.Label>Quesito</Form.Label>
      <Form.Control placeholder="Inserisci Quesito" onChange={(ev) => setQuesito(ev.target.value)} required/>
    </Form.Group>
  <Form.Group as={Col} >
      <Form.Label>Numero di Opzioni</Form.Label>
      <Form.Control as="select" onChange={(ev)=>{settoIlNumeroOpzioni(ev)}  
    } required>
        <option >{' '}</option>
        <option >1</option>
        <option >2</option>
        <option >3</option>
        <option >4</option>
        <option >5</option>
        <option >10</option>
      </Form.Control>
    </Form.Group>
    <Form.Group as={Col} controlid="formGridState">
      <Form.Label>Min</Form.Label>
      <Form.Control as="select" onChange={(ev)=>setMin(+ev.target.value)} required>
        <option>{' '}</option>
        <option>0</option>
        <option>1 </option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
      </Form.Control>
    </Form.Group>
    <Form.Group as={Col} controlid="formGridState">
      <Form.Label>Max</Form.Label>
      <Form.Control as="select" onChange={(ev)=>setMax(+ev.target.value)} required>
        <option>{' '}</option>
        <option >1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
        <option>10</option>
      </Form.Control>
    </Form.Group>
    </Form.Row>
    <Form.Row>  
{ opzioni.length!==0 && opzioni.map((t, i) => {
    return <Row key={i} className="align-items-center">
    <Col xs="auto">
    <Form.Group>
      <Form.Label htmlFor="inlineFormInput" visuallyhidden="true">
        Quesito {`${i}`}
      </Form.Label>
      <Form.Control type="text" name="description"
        className="mb-2"
        id={i}
        placeholder="Insert Option"
        onChange={(event)=>{registraOpzione(event.target.value, i)}}
      />
      </Form.Group>
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