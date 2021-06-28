import React, { useState } from 'react'
import {Card, Form, Button, Col, Row, Alert} from 'react-bootstrap'

const DomandaChiusa = (props)=>{
    const {Qid} = props
    const [min, setMin] = useState(undefined); 
    const [max, setMax] = useState(undefined);
    const [numOpzioni, setNumOpzioni] = useState(0); 
    const [quesito, setQuesito] = useState('')
    const [opzioni, setOpzioni] = useState([]);
    const [errore, setErrore] = useState({message:null})
    const [show, setShow] = useState(false);
    const sottometti=(event)=>{
        event.preventDefault();
        let opzionei
        let domanda = {};
        if(min > max || max > numOpzioni){
            //setto un errore e dovrà essere corretto
            setShow(true)
            if(min > max){
              setErrore({messsage: "Minimo > Massimo"})
            }else{
              setErrore({messsage: "Massimo > Numero Opzioni"})
            }
        }else{
          if (min === max || min >= 1){
            domanda.obbligatoria = 1
          }else{
            domanda.obbligatoria = 0
          }

        for(let i=0; i<numOpzioni; i++){
          opzionei = `opzione${i+1}`
          domanda[opzionei] = opzioni[i].opzione

        }
        
         domanda = {did: props.did, qid:Qid, modificabile:true, quesito: quesito, min: min, max:max, numopzioni: numOpzioni, tipo:1, opzioni: opzioni.map(t=>t), ...domanda}
         setOpzioni([])
         setNumOpzioni(0)
         props.aggiungiDomanda(domanda);
      }
    }

    const registraOpzione = (value, ind) =>{
      setOpzioni(oldstate => {
         return [...oldstate.map((item)=>{
            if(item.indice === ind){
              return { opzione: value, indice: ind}
            }else{
              return item
            }
          })]
        })
    }

    const settoIlNumeroOpzioni = (ev)=>{
      let vett = []
      const numOpzionitemp = parseInt(ev.target.value);

      setNumOpzioni(numOpzionitemp)
  
      for(let i=0; i<ev.target.value; i++){
        vett.push({opzione: "", indice:i})
      }
      setOpzioni(vett)

    }

return   <Card>
     {show && <Alert variant="danger" onClose={() => setShow(false)} dismissible>
     <Alert.Heading>Errore nei vincoli della domanda:</Alert.Heading>
        {errore.messsage}

      </Alert>}
      <Card.Header as="h5"><span>Domanda Chiusa</span></Card.Header>
 
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
        <option>{' '}</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
        <option>6</option>
        <option>7</option>
        <option>8</option>
        <option>9</option>
        <option>10</option>
      </Form.Control>
    </Form.Group>
    <Form.Group as={Col} controlid="formGridState">
      <Form.Label>Min</Form.Label>
      <Form.Control as="select" onChange={(ev)=>setMin(+ev.target.value)} required>
        <option>{' '}</option>
        <option>0</option>
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
        <option>6</option>
        <option>7</option>
        <option>8</option>
        <option>9</option>
        <option>10</option>
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
        <option>6</option>
        <option>7</option>
        <option>8</option>
        <option>9</option>
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
        Quesito {`${i+1}`}
      </Form.Label>
      <Form.Control type="text" name="description"
        className="mb-2"
        id={i}
        required
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
</Form>
</Card.Body>

  </Card>

}
export default DomandaChiusa;