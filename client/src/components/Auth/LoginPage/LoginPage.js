import React, { useRef, useContext, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import { Container, Form, Button, Col, Alert } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import { LoginContext } from '../../../context/login-context';

const LoginPage = () => {

    const refUsername = useRef(null);
    const refPassword = useRef(null);
    const loginContext = useContext(LoginContext);
    const [error, setError] = useState(null);

    const location = useLocation();
    const history = useHistory();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await loginContext.login({
                username: refUsername.current.value,
                password: refPassword.current.value
            });
            if (location.state && location.state.from) {
                history.push(location.state.from.pathname);
            } else {
                history.push('/campgrounds');
            }
        } catch (err) {
            setError(err.message);
        }
    }

    // if (loginContext.isAuthenticated()) {
    //     return <Redirect to="/campgrounds" />;
    // }

    const errorBanner = error && (
        <Alert variant="danger">The username or password is invalid</Alert>
    );

    return (
        <Container>
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
