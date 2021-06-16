import React, {useState} from 'react';
import { Navbar, Nav, Form, ListGroup, Button } from 'react-bootstrap/';
import { PersonCircle, CheckAll } from 'react-bootstrap-icons';
import {NavLink} from 'react-router-dom' 

const Navigation = (props) => {

  const [user, setUser] = useState('');
  const {globalUser, setGlobalUser} = props;
  const handler = (event)=>{
    event.preventDefault();
    props.registraUser(user)
    setGlobalUser(false)
  }

  return (
    <Navbar bg="success" variant="dark" fixed="top">
      { /* <Navbar.Toggle aria-controls="left-sidebar" onClick={this.showSidebar}/> */}
      <Navbar.Toggle aria-controls="left-sidebar" />
      <Navbar.Brand href="/">
        <CheckAll className="mr-1" size="30" /> ToDo Manager
      </Navbar.Brand>
      {globalUser && <Form inline className="my-0 mx-auto" onSubmit={handler}>
        <h6>Inserisci il nome:&#160;&#160;</h6>
        <Form.Control className="mr-2" type="text" placeholder="" onChange={(event)=>setUser(event.target.value)} />
        <Button variant="danger" size="sm" type="submit">
  
        Invia
        </Button>
      </Form>}
     <Nav className="ml-auto">
        <Nav.Item>
          <ListGroup variant="flush">
      <NavLink key = "#all" to = "/login"><ListGroup.Item action>login <PersonCircle size="30" /></ListGroup.Item></NavLink>
      
      </ListGroup>
           
          
        </Nav.Item>


      </Nav>
    </Navbar>
  )
}

export default Navigation;