import React, { useEffect, useState } from 'react';

import { Button, Container, Form, InputGroup } from 'react-bootstrap';

import classes from '../Campgrounds.module.css';

const TopArea = (props) => {

    const [search, setSearch] = useState('');
    const { queryChanged } = props;

    useEffect(() => {
        const timer = setTimeout(() => {
            queryChanged(search)
        }, 500);

        return () => {
            clearTimeout(timer)
        }
    }, [search, queryChanged]);

    const newButton = props.onNewCampground ?
        <Button
            variant="primary"
            size="lg"
            disabled={props.onNewCampground == null}
            onClick={props.onNewCampground}>Add new Campground</Button> : null;

    return (
        <div className={classes.Jumbotron}>
            <Container>
                <h1>Welcome to YelpCamp</h1>
                <p className="lead">View our hand-picked camp grounds from all over the world</p>
                {newButton}
                <Form className="mt-2 d-flex">
                        <Form.Label srOnly>Search Campgrounds</Form.Label>
                        <InputGroup>
                            <InputGroup.Text><i className="fas fa-search"></i></InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Search Campgrounds ..."
                                value={search}
                                onChange={event => setSearch(event.target.value)}
                            />
                        </InputGroup>
                    <Form.Group controlId="searchFilter">

                    </Form.Group>
                </Form>
            </Container>
        </div>
    );
}

export default TopArea;
