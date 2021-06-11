import React, {useState} from 'react'
import { Form, Col, Button } from 'react-bootstrap'

const FormPersonale = (props) => {

    const [titolo, setTitolo] = useState('')

    const chiudiForm = (event)=>{
        
        props.chiudiQuestionario();
    }

    const sottometti = (event) => {
        event.preventDefault();
        event.stopPropagation();
        props.compilaQuestionario(titolo) 
    }

return <Form onSubmit={sottometti}>
  <Form.Row>
    <h3>Crea Questionario</h3>
  </Form.Row>

  <Form.Group as={Col} controlId="formGridCity">
      <Form.Label>Titolo</Form.Label>
      <Form.Control onChange={(ev)=> setTitolo(ev.target.value)} required/>
    </Form.Group>

  <Button variant="primary" type="submit">
    Submit
  </Button>
  <Button variant="secondary" onClick={(event)=>chiudiForm(event)}>
    Close
  </Button>
</Form>
}
export default FormPersonale;