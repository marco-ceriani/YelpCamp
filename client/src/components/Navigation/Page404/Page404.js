import React from 'react';
import { useHistory } from 'react-router-dom';

import { Container, Row, Col, Button } from 'react-bootstrap';
import classes from './Page404.module.css';

const Page404 = () => {

    const history = useHistory();

    return (
        <Container>
            <Row className={classes.Title}>
                <Col>
                    <h2>Sorry, we couldn't find the page you are looking for.</h2>
                </Col>
            </Row>
            <Row className={classes.Buttons}>
                <Button variant="outline-primary" onClick={() => history.push('/')}>Go to the Home page</Button>
            </Row>
        </Container>
    );
}

export default Page404;
