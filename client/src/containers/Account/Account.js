import React, { useContext } from 'react';
import { Container, Row, Col, ResponsiveEmbed } from 'react-bootstrap';

import { LoginContext } from '../../context/login-context';
import classes from './Account.module.css';
import MyCampgrounds from '../../components/Campgrounds/UserCamps/UserCamps';
import useDataFetcher, { FetchSpinner, ErrorMessage } from '../../hooks/data-fetcher';

const Account = () => {

    const { id, fullName, username, avatar } = useContext(LoginContext);

    const [{ data, isLoading, error }] = useDataFetcher(`/rest/users/${id}/campgrounds`, { campgrounds: [] });
    const { campgrounds } = data;

    return (
        <Container>
            <Row>
                <Col sm="3">
                    <ResponsiveEmbed aspectRatio="1by1" className={classes.Image}>
                        <embed src={avatar} />
                    </ResponsiveEmbed>
                </Col>
                <Col sm="6">
                    <h1>{fullName}</h1>
                    <span className="font-italic">@{username}</span>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci commodi quasi ipsum. Molestias, minus perferendis. Nostrum illum quidem ipsa natus dolorem itaque alias facilis dignissimos in. Harum non modi quam.</p>
                </Col>
            </Row>
            <Row className={classes.Campgrounds}>
                <Col lg="9">
                    <FetchSpinner isLoading={isLoading} />
                    <ErrorMessage message="Error loading campgrounds info" error={error} />
                    <MyCampgrounds campgrounds={campgrounds} author />
                </Col>
            </Row>
        </Container>
    );
}

export default Account;
