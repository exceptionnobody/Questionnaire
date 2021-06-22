import React, {useState} from 'react';
import { Navbar, Nav, Form, ListGroup, Button } from 'react-bootstrap/';
import { PersonCircle, CheckAll } from 'react-bootstrap-icons';
import {NavLink} from 'react-router-dom' 

const Navigation = (props) => {

  const [user, setUser] = useState('');
  const {globalUser, setGlobalUser, loggedIn, message, doLogOut} = props;
  const handler = (event)=>{
    event.preventDefault();
    props.registraUser(user)
    setGlobalUser(false)
  }

  return (
    <Navbar bg="success" variant="dark" fixed="top" className={`bg-${message ? message.color :"warning"}`}>
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
    
      {loggedIn ? <>

<button type="button" className="navbar-nav ml-md-auto btn-danger btn-sm" disabled>

&nbsp;&nbsp;&nbsp;&nbsp; 

<span>{message.msg}</span>

&nbsp;&nbsp;&nbsp;

</button>

<ListGroup variant="flush">

<NavLink key = "#logout" to = "/"><ListGroup.Item onClick={() => doLogOut()}  variant="dark">

   <svg className="bi bi-people-circle" width="30" height="30" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">

      <path d="M13.468 12.37C12.758 11.226 11.195 10 8 10s-4.757 1.225-5.468 2.37A6.987 6.987 0 008 15a6.987 6.987 0 005.468-2.63z" />

      <path fillRule="evenodd" d="M8 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />

      <path fillRule="evenodd" d="M8 1a7 7 0 100 14A7 7 0 008 1zM0 8a8 8 0 1116 0A8 8 0 010 8z" clipRule="evenodd" />

    </svg>

    <span>  logout</span>

    </ListGroup.Item></NavLink>

    </ListGroup>

 </>:  <Nav className="ml-auto">
        <Nav.Item>
          <ListGroup variant="flush">
      <NavLink key = "#all" to = "/login"><ListGroup.Item action>login <PersonCircle size="30" /></ListGroup.Item></NavLink>
      </ListGroup>
      </Nav.Item>
      </Nav>}


      
    </Navbar>
  )
}

export default Navigation;