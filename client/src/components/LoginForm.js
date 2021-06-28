import { useState } from "react";
import { Form, Button, Alert, Container, Col, Row } from 'react-bootstrap';

function LoginForm(props) {
    const { message, setMessage } = props;
    const [username, setUsername] = useState('admin1');
    const [password, setPassword] = useState('password');
    const [errorMessage, setErrorMessage] = useState('');
    const [errorFlag, setErrorFlag] = useState(false)

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');
        const credentials = { username, password };
        let valid = true;
        let errors = "";

        if (password.length < 6) {
            valid = false;
            errors += "Password length must be at least 6 characters"
        }

        if (valid) {
            setErrorFlag(false)
            props.login(credentials);
        }
        else {
            setErrorFlag(true);
            setErrorMessage(errors)
        }
    };

    return (
        <Container fluid >
            <Row className="justify-content-md-center">
                <Col md="auto" className="col-sm-5 col-md-3 below-nav text-center border border-light " >
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-person-check" viewBox="0 0 16 16">
                        <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                        <path fillRule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                    </svg>
                    <h2 className="h3 mb-3 fw-normal"> Please sign in </h2>

                    <Form>
                        {errorFlag ? <Alert variant='danger' onClose={() => { setErrorMessage(''); setErrorFlag(false) }} dismissible>{errorMessage.split('\n').map((str, i) => <p key={i}>{str}</p>)}</Alert> : null}
                        {message.msg && <Alert variant='warning' onClose={() => setMessage({ msg: "", color: "warning" })} dismissible>{message.msg}</Alert>}
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Username</Form.Label>
                            <Form.Control  value={username} placeholder="Enter email" onChange={ev => setUsername(ev.target.value)} required />
                        </Form.Group>
                        <Form.Group controlId='password'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type='password' value={password} placeholder="Password" onChange={ev => setPassword(ev.target.value)} required />
                        </Form.Group>
                        <fieldset disabled>
                            <Form.Group className="mb-3">
                                <Form.Check type="checkbox" id="disabledFieldsetCheck" label="Remember me" checked={true} readOnly/>
                            </Form.Group>
                        </fieldset>
                        <Button onClick={handleSubmit} size="lg" type="submit" className="w-100 btn btn-lg btn-primary">Login</Button>
                        <p className="mt-5 mb-3 text-muted"> Francesco Galazzo © 2021</p>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default LoginForm ;