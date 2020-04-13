import React from 'react';
import { LinkContainer } from 'react-router-bootstrap'

import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import classes from './CampgroundCard.module.css';

const CampgroundCard = props => {

    const imgClasses = ["img-thumbnail", classes.Image];
    return (
        <Col sm="6" md="4" lg="3" className="mb-3">
            <div className="embed-responsive embed-responsive-4by3">
                <img src={props.image} className={imgClasses.join(" ")} alt={props.name} />
            </div>
            <h4>{props.name}</h4>
            <LinkContainer to={"/campgrounds/" + props.id}>
                <Button variant="primary">More Info</Button>
            </LinkContainer>

        </Col>
    );
}

export default CampgroundCard;
