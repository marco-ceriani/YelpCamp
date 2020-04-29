import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, ResponsiveEmbed } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { LoginContext } from '../../context/login-context';
import classes from './Profile.module.css';
import MyCampgrounds from '../../components/Campgrounds/UserCamps/UserCamps';

const Profile = (props) => {

    const authContext = useContext(LoginContext);
    const routeUser = useParams().user;

    const loggedUserData = useCallback(() => {
        return {
            _id: authContext.userId,
            fullName: authContext.fullname,
            username: authContext.username,
            avatar: authContext.avatar
        }
    }, [authContext]);

    const [userInfo, setUserInfo] = useState(routeUser === 'self' ? loggedUserData()
        : { _id: routeUser, fullName: '', username: null, avatar: null });
    const [campgrounds, setCampgrounds] = useState([]);

    useEffect(() => {
        axios.get(`/rest/users/${userInfo._id}/campgrounds`)
            .then(resp => {
                setCampgrounds(resp.data.campgrounds)
            });
    }, [userInfo._id]);

    useEffect(() => {
        if (routeUser !== 'self') {
            axios.get(`/rest/users/${userInfo._id}`)
                .then(resp => {
                    setUserInfo(resp.data);
                });
        } else {
            setUserInfo(loggedUserData());
        }
    }, [userInfo._id, routeUser, loggedUserData]);

    return (
        <Container>
            <Row>
                <Col sm="3">
                    <ResponsiveEmbed aspectRatio="1by1" className={classes.Image}>
                        <embed src={userInfo.avatar} />
                    </ResponsiveEmbed>
                </Col>
                <Col sm="6">
                    <h1>{userInfo.fullName}</h1>
                    <span className="font-italic">@{userInfo.username}</span>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci commodi quasi ipsum. Molestias, minus perferendis. Nostrum illum quidem ipsa natus dolorem itaque alias facilis dignissimos in. Harum non modi quam.</p>
                </Col>
            </Row>
            <Row className={classes.Campgrounds}>
                <Col lg="9">
                    <MyCampgrounds campgrounds={campgrounds} author={routeUser === 'self'} />
                </Col>
            </Row>
        </Container>
    );
}

export default Profile;
