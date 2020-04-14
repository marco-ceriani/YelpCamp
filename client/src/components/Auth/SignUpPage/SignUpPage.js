import React, { useState, useRef } from 'react';
import axios from 'axios';

import {Container, Form, Button} from 'react-bootstrap';

const LoginPage = props => {

    const [validated, setValidated] = useState(false);
    const refUsername = useRef(null);
    const refPassword = useRef(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        axios.post('/rest/login', {
            username: refUsername.current.value,
            password: refPassword.current.value
        })
        .then(resp => {
            const {id, username} = resp.data;
            console.log('Logged user ' + username);
        })
    }

    return (
        <Container>
            <h1 className="text-center">Register</h1>
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
