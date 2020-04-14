import React, { useRef, useContext, useState } from 'react';
import axios from 'axios';

import { Container, Form, Button, Col, Alert } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import { LoginContext } from '../../../context/login-context';

const LoginPage = props => {

    const refUsername = useRef(null);
    const refPassword = useRef(null);
    const loginContext = useContext(LoginContext);
    const [error, setError] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('/rest/auth/login', {
            username: refUsername.current.value,
            password: refPassword.current.value
        }).then(resp => {
            const { id, fullname, avatar } = resp.data;
            loginContext.login(id, fullname, avatar);
        }).catch(err => {
            setError(err.message);
        })
    }

    const redirGuard = loginContext.userId && <Redirect to="/campgrounds" />
    const errorBanner = error && (
        <Alert variant="danger">The username or password is invalid</Alert>
    );

    return (
        <Container>
            {redirGuard}
            <Col sm="9" lg="6" className="mx-auto">
                <h1 className="text-center mb-4">Login</h1>
                {errorBanner}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="username">
                        <Form.Label srOnly>Username</Form.Label>
                        <Form.Control type="text" required placeholder="User name" ref={refUsername}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label srOnly>Password</Form.Label>
                        <Form.Control type="password" required placeholder="password" pattern=".{4,}" ref={refPassword}></Form.Control>
                    </Form.Group>
                    <Button variant="primary" type="submit">Login</Button>
                </Form>
            </Col>
        </Container>
    )
}

export default LoginPage;
