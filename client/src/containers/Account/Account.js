import React, { useContext, useState } from 'react';
import { Container, Row, Col, Button, ResponsiveEmbed, Modal } from 'react-bootstrap';
import axios from 'axios';

import { LoginContext } from '../../context/login-context';
import classes from './Account.module.css';
import MyCampgrounds from '../../components/Campgrounds/UserCamps/UserCamps';
import useDataFetcher, { FetchSpinner, ErrorMessage } from '../../hooks/data-fetcher';
import PasswordChange from '../../components/Users/PasswordChange';


const Account = () => {

    const { id, fullName, username, avatar } = useContext(LoginContext);

    const [{ data, isLoading, error }] = useDataFetcher(`/rest/users/${id}/campgrounds`, { campgrounds: [] });
    const { campgrounds } = data;

    const [passwordState, setPasswordState] = useState({ show: false });

    const changePassword = async ({ _id, password, currentPassword }) => {
        try {
            await axios.patch(`/rest/users/${_id}/password`, {
                currentPassword: currentPassword,
                newPassword: password
            })
            setPasswordState({ show: false });
        } catch (error) {
            console.warn('ERROR changing user password', error.response)
            setPasswordState({
                show: true,
                error: error.response.data.message
            })
        }
    }

    return (
        <Container>
            <Row className="mb-4">
                <Col sm="3">
                    <ResponsiveEmbed aspectRatio="1by1" className={classes.Image}>
                        <embed src={avatar} />
                    </ResponsiveEmbed>
                </Col>
                <Col sm="6">
                    <h1>{fullName}</h1>
                    <span className="font-italic">@{username}</span>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci commodi quasi ipsum. Molestias, minus perferendis. Nostrum illum quidem ipsa natus dolorem itaque alias facilis dignissimos in. Harum non modi quam.</p>
                    <Button onClick={() => setPasswordState({ show: true })}>Change password</Button>
                </Col>
            </Row>
            <Row className={classes.Campgrounds}>
                <Col lg="9">
                    <FetchSpinner isLoading={isLoading} />
                    <ErrorMessage message="Error loading campgrounds info" error={error} />
                    <MyCampgrounds campgrounds={campgrounds} author />
                </Col>
            </Row>
            <Modal show={passwordState.show}
                centered
                onHide={() => setPasswordState({ show: false })} >
                <Modal.Header>
                    <Modal.Title>Change Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <PasswordChange askForPassword
                        user={{ _id: id }}
                        error={passwordState.error}
                        onConfirm={changePassword}
                        onCancel={() => setPasswordState({ show: false })} />
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default Account;
