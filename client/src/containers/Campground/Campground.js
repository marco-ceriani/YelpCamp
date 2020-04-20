import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';

import Map from '../../components/Map/Map';
import Comments from '../../components/Campgrounds/Comments/Comments';

const Campground = props => {

    const campId = props.match.params.id;

    const [campInfo, setCampInfo] = useState(null);

    useEffect(() => {
        axios.get(`/rest/campgrounds/${campId}`)
            .then(resp => {
                const { comments, ...info } = resp.data;
                setCampInfo(info);
            });
    }, [campId]);

    return (
        <Container>
            <Row>
                <Col md="3">
                    <p className="lead">YelpCamp</p>
                    <ListGroup>
                        <ListGroup.Item active>Info 1</ListGroup.Item>
                        <ListGroup.Item>Info 2</ListGroup.Item>
                        <ListGroup.Item>Info 3</ListGroup.Item>
                    </ListGroup>
                    <Map url={campInfo && campInfo.mapurl} maplink={campInfo && campInfo.maplink} />
                </Col>
                <Col md="9">
                    {
                        campInfo ?
                            <Card>
                                <Card.Img variant="top" src={campInfo.image} />
                                <Card.Body>
                                    <div className="d-flex justify-content-between">
                                        <Card.Title>{campInfo.name}</Card.Title>
                                        <h5 className="text-right">{campInfo.price}/night</h5>
                                    </div>
                                    <p>{campInfo.description}</p>
                                    <p>
                                        <em>Submitted By <a href={`/users/${campInfo.author.id}`}>{campInfo.author.username}</a>, {moment(campInfo.createdAt).fromNow()}</em>
                                    </p>
                                </Card.Body>
                            </Card>
                            : <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                    }
                    <Comments
                        campId={campId}
                        // onNewComment={newCommentHandler}
                        // onUpdateComment={updateCommentHandler}
                        // onCommentDelete={commentDeleteHandler}
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default Campground;
