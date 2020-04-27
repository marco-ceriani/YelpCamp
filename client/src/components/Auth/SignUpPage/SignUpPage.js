import React, { useRef, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import { Container, Row, Col, Form, Button } from 'react-bootstrap';

import { LoginContext } from '../../../context/login-context';

const LoginPage = props => {

    const loginContext = useContext(LoginContext);

    const refUsername = useRef(null);
    const refPassword = useRef(null);
    const refFullName = useRef(null);
    const refAvatar = useRef(null);
    const refEmail = useRef(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('/rest/auth/register', {
            username: refUsername.current.value,
            password: refPassword.current.value,
            fullName: refFullName.current.value,
            avatar: refAvatar.current.value,
            email: refEmail.current.value
        }).then(resp => {
            const { id, fullname, avatar } = resp.data;
            loginContext.login(id, fullname, avatar);
        })
    }

    const redirGuard = loginContext.userId && <Redirect to="/campgrounds" />

    return (
        <Container>
            {redirGuard}
            <h1 className="text-center mb-4 mt-5">Sign Up</h1>
            <Row>
                <Col sm="9" lg="6" className="mx-auto">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group as={Row} controlId="username">
                            <Form.Label column>Username</Form.Label>
                            <Col md="9">
                                <Form.Control type="text" required placeholder="mickey" ref={refUsername}></Form.Control>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="password">
                            <Form.Label column>Password</Form.Label>
                            <Col md="9">
                                <Form.Control type="password" required placeholder="password" ref={refPassword}></Form.Control>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="fullName">
                            <Form.Label column>Personal Name</Form.Label>
                            <Col md="9">
                                <Form.Control type="text" required placeholder="Mickey Mouse" ref={refFullName}></Form.Control>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="avatar">
                            <Form.Label column>Avatar</Form.Label>
                            <Col md="9">
                                <Form.Control type="url" required placeholder="image url" ref={refAvatar}></Form.Control>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="email">
                            <Form.Label column>Email address</Form.Label>
                            <Col md="9">
                                <Form.Control type="email" required placeholder="mickey@mouse.com" ref={refEmail}></Form.Control>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="justify-content-end">
                            <Col md="9">
                                <Button variant="primary" type="submit">Sign Up</Button>
                            </Col>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default LoginPage;
