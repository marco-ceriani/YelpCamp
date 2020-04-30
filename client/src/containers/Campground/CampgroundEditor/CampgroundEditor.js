import React, { useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

import { Container, Col, Row, Form, Button, ButtonGroup, ResponsiveEmbed } from 'react-bootstrap';
import useDataFetcher, { FetchSpinner, ErrorMessage } from '../../../hooks/data-fetcher';
import Map from '../../../components/Map/Map';

import classes from './CampgroundEditor.module.css';

const EMPTY_INFO = {
    name: '',
    description: '',
    price: 0,
    image: '',
    location: { textual: '' }
}

const CampgroundEditor = props => {

    const { id: campId } = useParams();
    const history = useHistory();

    const [{ data: campInfo, isLoading, error }, {fetchData, setData}] = useDataFetcher(
        `/rest/campgrounds/${campId}`, EMPTY_INFO);

    const reloadInfo = useCallback(() => {
        fetchData(`/rest/campgrounds/${campId}`, { force: true });
    }, [campId, fetchData]);

    if (!campInfo) {
        return <FetchSpinner isLoading={isLoading} />
    }

    const fieldChangeHandler = (field, event) => {
        const newInfo = { ...campInfo };
        if (field === 'location') {
            newInfo.location = {
                textual: event.target.value
            }
        } else {
            newInfo[field] = event.target.value
        }
        setData(newInfo);
    }

    const saveCampgroundState = (info) => {
        axios.put(`/rest/campgrounds/${campId}`, info)
            .then(resp => {
                setData(resp.data.camp)
            })
    }

    const saveHandler = () => {
        saveCampgroundState(campInfo)
    }

    const publishHandler = () => {
        saveCampgroundState({
            ...campInfo,
            public: true
        })
    }

    const retireHandler = () => {
        saveCampgroundState({
            ...campInfo,
            public: false
        })
    }

    const deleteHanlder = () => {
        axios.delete(`/rest/campgrounds/${campId}`)
            .then(resp => {
                history.push('/profile')
            })
    }

    return (
        <Container>
            <Row>
                <Col md="9" className="mx-auto">
                    <Form>
                        <div className={classes.ButtonBar}>
                            <ButtonGroup aria-label="edit buttons">
                                <Button variant="secondary" onClick={reloadInfo}>Cancel</Button>
                                <Button onClick={saveHandler}>Save</Button>
                            </ButtonGroup>
                            {campInfo.public
                                ? <Button onClick={retireHandler} variant="warning">Retire</Button>
                                : <Button onClick={publishHandler} variant="success">Publish</Button>}
                            <Button variant="danger" onClick={deleteHanlder}>Delete</Button>
                        </div>
                        <ErrorMessage message="Error loading info" error={error} />
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" size="lg"
                                value={campInfo.name}
                                onChange={event => fieldChangeHandler('name', event)} />
                        </Form.Group>
                        <Form.Group controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows="10"
                                value={campInfo.description}
                                onChange={event => fieldChangeHandler('description', event)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Control type="number" placeholder="Price" min="0.01" step="0.01"
                                value={campInfo.price}
                                onChange={event => fieldChangeHandler('price', event)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Picture</Form.Label>
                            <Form.Control type="text" autoComplete="off" placeholder="Picture"
                                value={campInfo.image}
                                onChange={event => fieldChangeHandler('image', event)} />
                            {
                                campInfo.image && <ResponsiveEmbed aspectRatio="4by3">
                                    <embed type="image/jpeg" src={campInfo.image} />
                                </ResponsiveEmbed>
                            }
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Campground Location</Form.Label>
                            <Form.Control type="text" autoComplete="off" placeholder="Location"
                                value={campInfo.location && campInfo.location.textual}
                                onChange={event => fieldChangeHandler('location', event)} />
                            <Map url={campInfo && campInfo.mapurl} maplink={campInfo && campInfo.maplink} />
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default CampgroundEditor;
