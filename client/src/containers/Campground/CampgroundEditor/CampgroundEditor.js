import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

import { Container, Col, Row, Form, Button, ButtonGroup } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import Map from '../../../components/Map/Map';

import classes from './CampgroundEditor.module.css';

const CampgroundEditor = props => {

    const campId = useParams().id;
    const history = useHistory();

    const [campInfo, setCampInfo] = useState(null);

    useEffect(() => {
        axios.get(`/rest/campgrounds/${campId}`)
            .then(resp => {
                const { comments, ...info } = resp.data;
                setCampInfo(info);
            });
    }, [campId]);

    if (!campInfo) {
        return <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
        </Spinner>
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
        setCampInfo(newInfo);
    }

    const saveCampgroundState = (info) => {
        axios.put(`/rest/campgrounds/${campId}`, info)
            .then(resp => {
                setCampInfo(resp.data.camp)
            })
    }

    const saveHandler = () => {
        axios.put(`/rest/campgrounds/${campId}`, campInfo)
            .then(resp => {
                setCampInfo(resp.data.camp)
            })
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
                                <Button variant="secondary">Cancel</Button>
                                <Button onClick={saveHandler}>Save</Button>
                            </ButtonGroup>
                            {campInfo.public
                                ? <Button onClick={retireHandler}>Retire</Button>
                                : <Button onClick={publishHandler}>Publish</Button>}
                            <Button variant="danger" onClick={deleteHanlder}>Delete</Button>
                        </div>
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
                            <Form.Control type="text" autoComplete="off" placeholder="Picture"
                                value={campInfo.image}
                                onChange={event => fieldChangeHandler('image', event)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Control type="text" autoComplete="off" placeholder="Location"
                                value={campInfo.location && campInfo.location.textual}
                                onChange={event => fieldChangeHandler('location', event)} />
                        </Form.Group>
                        <Map url={campInfo && campInfo.mapurl} maplink={campInfo && campInfo.maplink} />
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default CampgroundEditor;
