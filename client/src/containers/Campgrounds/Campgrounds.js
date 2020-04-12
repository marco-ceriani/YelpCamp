import React, { useState, useEffect } from 'react';
import axios from 'axios';

import TopArea from './TopArea/TopArea';
import CampgroundCard from './CampgroundCard/CampgroundCard';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const campgroundCard = camp => (
    <CampgroundCard
        key={camp.id}
        name={camp.name}
        image={camp.image}
    />
)

const Campgrounds = (props) => {

    const [campgrounds, setCampgrounds] = useState([]);
    const [query, setQuery] = useState('');

    useEffect(() => {
        const queryArgs = query ? `?search=${query}` : '';
        axios.get('/rest/campgrounds' + queryArgs)
            .then(resp => {
                setCampgrounds(resp.data.campgrounds)
            })
    }, [query, setCampgrounds]);

    const campgroundsCards = campgrounds.map(campgroundCard);

    return (
        <Container>
            <TopArea query={query} queryChanged={setQuery} />

            <Row>
                <Col lg="12">
                    <h3>Our Most Popular Campgrounds</h3>
                </Col>
            </Row>

            <Row className="text-center">
                {campgroundsCards}
            </Row>

        </Container>
    );
}

export default Campgrounds;
