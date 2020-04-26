import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import axios from 'axios';

import TopArea from './TopArea/TopArea';
import CampgroundCard from '../../components/Campgrounds/CampgroundCard/CampgroundCard';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const campgroundCard = camp => (
    <CampgroundCard
        key={camp.id}
        id={camp.id}
        name={camp.name}
        image={camp.image}
    />
)

const Campgrounds = (props) => {

    const [campgrounds, setCampgrounds] = useState([]);
    const [query, setQuery] = useState('');
    const history = useHistory();

    useEffect(() => {
        const queryArgs = query ? `?search=${query}` : '';
        axios.get('/rest/campgrounds' + queryArgs)
            .then(resp => {
                setCampgrounds(resp.data.campgrounds)
            })
    }, [query, setCampgrounds]);

    const newCampgroundHandler = () => {
        axios.post('/rest/campgrounds')
            .then(resp => resp.data.camp)
            .then(camp => {
                history.push(`/campgrounds/${camp.id}/edit`);
            })
    }

    return (
        <Container>
            <TopArea query={query} queryChanged={setQuery} onNewCampground={newCampgroundHandler}/>

            <Row>
                <Col lg="12">
                    <h3>Our Most Popular Campgrounds</h3>
                </Col>
            </Row>

            <Row className="text-center">
                {campgrounds.map(campgroundCard)}
            </Row>

        </Container>
    );
}

export default Campgrounds;
