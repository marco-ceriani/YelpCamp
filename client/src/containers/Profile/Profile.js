import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, ResponsiveEmbed } from 'react-bootstrap';
import axios from 'axios';

import { LoginContext } from '../../context/login-context';
import classes from './Profile.module.css';
import MyCampgrounds from '../../components/Campgrounds/UserCamps/UserCamps';

const Profile = (props) => {

    const {userId, name, avatar} = useContext(LoginContext);
    const [campgrounds, setCampgrounds] = useState([]);
    

    useEffect(() => {
        axios.get(`/rest/users/${userId}/campgrounds`)
            .then(resp => {
                setCampgrounds(resp.data.campgrounds)
            });
    }, [userId]);

    return (
        <Container>
            <Row>
                <Col sm="3">
                    <ResponsiveEmbed aspectRatio="1by1" className={classes.Image}>
                        <embed src={avatar} />
                    </ResponsiveEmbed>
                </Col>
                <Col sm="6">
                    <h1>{name}</h1>
                    <span className="font-italic">{name}</span>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci commodi quasi ipsum. Molestias, minus perferendis. Nostrum illum quidem ipsa natus dolorem itaque alias facilis dignissimos in. Harum non modi quam.</p>
                </Col>
            </Row>
            <Row className={classes.Campgrounds}>
                <Col lg="9">
                    <MyCampgrounds campgrounds={campgrounds} />
                </Col>
            </Row>
        </Container>
    );
}

export default Profile;
