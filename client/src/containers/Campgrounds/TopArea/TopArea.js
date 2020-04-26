import React, { useEffect, useState } from 'react';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const TopArea = (props) => {

    const [search, setSearch] = useState('');
    const {queryChanged} = props;

    useEffect(() => {
        const timer = setTimeout(() => {
            queryChanged(search)
        }, 500);
        
        return () => {
            clearTimeout(timer)
        }
    }, [search, queryChanged]);

    return (
            <Jumbotron>
                <Container>
                    <h1>Welcome to YelpCamp</h1>

                    <p className="lead">View our hand-picked camp grounds from all over the world</p>
                    <Button variant="primary" size="lg" onClick={props.onNewCampground}>Add new Campground</Button>
                    <Form className="mt-2">
                        <Form.Row>
                            <Col xs="auto">
                                <Form.Group controlId="searchFilter">
                                    <Form.Label srOnly>Campground Search</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Campground search ..."
                                        value={search}
                                        onChange={event => setSearch(event.target.value)}
                                        />
                                </Form.Group>
                            </Col>
                            <Col xs="auto">
                                <Button type="submit" variant="primary">Search</Button>
                            </Col>
                        </Form.Row>
                    </Form>
                </Container>
            </Jumbotron>
    );
}

export default TopArea;
