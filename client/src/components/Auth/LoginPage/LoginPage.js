import React, { useRef, useContext } from 'react';
import axios from 'axios';

import {Container, Form, Button} from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import { LoginContext } from '../../../context/login-context';

const LoginPage = props => {

    const refUsername = useRef(null);
    const refPassword = useRef(null);
    const loginContext = useContext(LoginContext);

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('/rest/auth/login', {
            username: refUsername.current.value,
            password: refPassword.current.value
        })
        .then(resp => {
            const {id, fullname} = resp.data;
            loginContext.login(id, fullname);
        })
    }

    const redirGuard = loginContext.userId && <Redirect to="/campgrounds" />

    return (
        <Container>
            {redirGuard}
            <h1 className="text-center">Login</h1>
            <div className="mt-4 w-50 mx-auto">
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
            </div>
        </Container>
    )
}

export default LoginPage;
