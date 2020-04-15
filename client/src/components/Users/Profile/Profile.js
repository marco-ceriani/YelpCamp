import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

import { LoginContext } from '../../../context/login-context';
import classes from './Profile.module.css';

const Profile = (props) => {

    const authContext = useContext(LoginContext);

    const imgClasses = ["img-thumbnail", "rounded-circle", classes.Image].join(" ");

    return (
        <Container>
            <Row>
                <Col sm="3">
                    <img src={authContext.avatar} alt="user profile image" className={imgClasses} />
                </Col>
                <Col sm="6">
                    <h1>{authContext.name}</h1>
                    <span class="font-italic">{authContext.name}</span>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci commodi quasi ipsum. Molestias, minus perferendis. Nostrum illum quidem ipsa natus dolorem itaque alias facilis dignissimos in. Harum non modi quam.</p>
                </Col>
            </Row>
            <Row></Row>
        </Container>
    );
}

export default Profile;
