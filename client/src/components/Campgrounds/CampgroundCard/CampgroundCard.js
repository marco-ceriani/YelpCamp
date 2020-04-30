import React from 'react';
import { LinkContainer } from 'react-router-bootstrap'

import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import Image4By3 from '../../UI/Image4By3/Image4By3';

const CampgroundCard = ({name, image, id}) => {

    return (
        <Col sm="6" md="4" lg="3" className="mb-3">
            <Image4By3 src={image} alt={name} />
            <h4>{name}</h4>
            <LinkContainer to={"/campgrounds/" + id}>
                <Button variant="primary">More Info</Button>
            </LinkContainer>

        </Col>
    );
}

export default CampgroundCard;
