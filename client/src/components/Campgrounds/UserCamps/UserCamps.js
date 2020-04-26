import React from 'react';
import { useHistory } from "react-router-dom";

import { Container, Row, Col, ListGroup, Button } from 'react-bootstrap';
import classes from './UserCamps.module.css';

const MyCampgrounds = props => {

    const history = useHistory();

    const openCampground = campId => {
        history.push(`/campgrounds/${campId}`)
    }

    const editCampground = campId => {
        history.push(`/campgrounds/${campId}/edit`)
    }

    const listItem = camp => (
        <ListGroup.Item key={camp._id} className={classes.CampRow} >
            <label className={classes.CampLabel} onClick={() => openCampground(camp._id)}>{camp.name}</label>
            <Button size="sm" onClick={() => editCampground(camp._id)}>Edit</Button>
        </ListGroup.Item>
    );

    const publicCamps = props.campgrounds.filter(camp => (camp.public == null || camp.public));
    const privateCamps = props.campgrounds.filter(camp => camp.public === false);
    console.log(privateCamps);
    console.log(publicCamps);

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md="9">
                    {privateCamps.length > 0 && <h3>Campgrounds in preparation</h3>}
                    <ListGroup>
                        {privateCamps.map(listItem)}
                    </ListGroup>
                    {publicCamps.length > 0 && <h3>Submitted Campgrounds</h3>}
                    <ListGroup>
                        {publicCamps.map(listItem)}
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    )

}

export default MyCampgrounds;
