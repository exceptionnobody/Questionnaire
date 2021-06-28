import React, {useState} from 'react'
import { Form, Col, Button } from 'react-bootstrap'

const FormPersonale = (props) => {

    const [titolo, setTitolo] = useState('')

    const sottometti = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.target
        const isValid = form.checkValidity();
        if(isValid){
           props.compilaQuestionario(titolo)  
        }
    }

return <>
<h3>Crea Questionario</h3>
<Form onSubmit={(event)=>sottometti(event)} id="formuser">

  <Form.Row className="align-items-center">
  <Col xs={6} className="my-1">
      <Form.Label htmlFor="inlineFormInputName" srOnly>Titolo</Form.Label>
      <Form.Control onChange={(ev)=> setTitolo(ev.target.value)} required placeholder="Titolo"/>
  </Col>
  <Col  sm={3} className="my-1">
  <Button variant="success" className="ml-1"  type="submit">
    Submit
  </Button>  
  </Col>

</Form.Row>
</Form>
</>
}
export default FormPersonale;