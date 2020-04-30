import React from 'react';
import moment from 'moment';

import { Container, Row, Col, ListGroup, Card } from 'react-bootstrap';

import Map from '../../components/Map/Map';
import Comments from '../../components/Campgrounds/Comments/Comments';
import useDataFetcher, { FetchSpinner } from '../../hooks/data-fetcher';

const Campground = props => {

    const campId = props.match.params.id;

    const [{ data: campInfo, isLoading, error }] = useDataFetcher(`/rest/campgrounds/${campId}`, null);

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
                    <FetchSpinner isLoading={isLoading} />
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
                                        <em>Submitted By <a href={`/v2/users/${campInfo.author.id}`}>{campInfo.author.username}</a>, {moment(campInfo.createdAt).fromNow()}</em>
                                    </p>
                                </Card.Body>
                            </Card>
                            : null
                    }
                    <Comments campId={campId}
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default Campground;
