import React from 'react';
import { Container, Row, Col, ResponsiveEmbed } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import classes from './Profile.module.css';
import MyCampgrounds from '../../components/Campgrounds/UserCamps/UserCamps';
import useDataFetcher, { FetchSpinner, ErrorMessage } from '../../hooks/data-fetcher';

const Profile = (props) => {

    const { user: userId } = useParams();

    const [{ data: userInfo, isLoading: userLoading, error: userError }] = useDataFetcher(
        `/rest/users/${userId}`, { _id: userId });

    const [{ data: { campgrounds }, isLoading: campsLoading, error: campsError }] = useDataFetcher(
        `/rest/users/${userInfo._id}/campgrounds`, { campgrounds: [] });

    return (
        <Container>
            <Row>
                <Col sm="3">
                    <ResponsiveEmbed aspectRatio="1by1" className={classes.Image}>
                        <embed src={userInfo.avatar} />
                    </ResponsiveEmbed>
                </Col>
                <Col sm="6">
                    <FetchSpinner isLoading={userLoading} />
                    <ErrorMessage message="Error loading user's profile" error={userError} />
                    <h1>{userInfo.fullName}</h1>
                    <span className="font-italic">@{userInfo.username}</span>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci commodi quasi ipsum. Molestias, minus perferendis. Nostrum illum quidem ipsa natus dolorem itaque alias facilis dignissimos in. Harum non modi quam.</p>
                </Col>
            </Row>
            <Row className={classes.Campgrounds}>
                <Col lg="9">
                    <FetchSpinner isLoading={campsLoading} />
                    <ErrorMessage message="Error loading user's campgrounds" error={campsError} />
                    <MyCampgrounds campgrounds={campgrounds} />
                </Col>
            </Row>
        </Container>
    );
}

export default Profile;
