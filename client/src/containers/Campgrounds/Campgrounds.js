import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom'
import axios from 'axios';

import TopArea from './TopArea/TopArea';
import CampgroundsGrid from '../../components/Campgrounds/CampgroundsGrid/CampgroundsGrid';
import useDataFetcher, { ErrorMessage, FetchSpinner } from '../../hooks/data-fetcher';

import { Container, Row, Col } from 'react-bootstrap';

const Campgrounds = () => {

    const [query, setQuery] = useState('');
    const history = useHistory();

    const [{ data, isLoading, error }, { fetchData }] = useDataFetcher('/rest/campgrounds', { campgrounds: [] });

    useEffect(() => {
        const queryArgs = query ? `?search=${query}` : '';
        fetchData('/rest/campgrounds' + queryArgs)
    }, [query, fetchData]);

    const newCampgroundHandler = useCallback(() => {
        axios.post('/rest/campgrounds')
            .then(resp => resp.data.camp)
            .then(camp => {
                history.push(`/campgrounds/${camp.id}/edit`);
            })
    }, [history]);

    return (
        <Container>
            <TopArea query={query} queryChanged={setQuery} onNewCampground={newCampgroundHandler} />

            <Row>
                <Col lg="12">
                    <h3>Our Most Popular Campgrounds</h3>
                </Col>
            </Row>
            <FetchSpinner isLoading={isLoading} />
            <ErrorMessage className="mb-2" message="An error occurred while loading the campgrounds" error={error} />
            <CampgroundsGrid campgrounds={data.campgrounds} />

        </Container>
    );
}

export default Campgrounds;
