import React from 'react';
import { useHistory } from "react-router-dom";

import { ListGroup, Button } from 'react-bootstrap';
import classes from './UserCamps.module.css';

const UserCamps = props => {

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
            {props.author && <Button size="sm" onClick={() => editCampground(camp._id)}>Edit</Button>}
        </ListGroup.Item>
    );

    const publicCamps = props.campgrounds.filter(camp => (camp.public == null || camp.public));
    const privateCamps = props.author? props.campgrounds.filter(camp => camp.public === false) : [];

    return (
        <>
            {privateCamps.length > 0 && <h3 className={classes.Title}>Campgrounds in preparation</h3>}
            <ListGroup>
                {privateCamps.map(listItem)}
            </ListGroup>
            {publicCamps.length > 0 && <h3 className={classes.Title}>Submitted Campgrounds</h3>}
            <ListGroup>
                {publicCamps.map(listItem)}
            </ListGroup>
        </>
    )

}

export default UserCamps;
