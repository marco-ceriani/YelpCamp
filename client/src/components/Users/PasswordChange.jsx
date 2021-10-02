import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Form, Row, Col, Button, Alert } from 'react-bootstrap';

const PasswordChangeForm = (props) => {

    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const changePassword = (e) => {
        setPassword(e.target.value);
    }

    const changeConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    }

    if (props.user === undefined || props.user === null) {
        return <></>
    }

    const isPasswordValid = password.length >= 8;

    const isConfirmedPasswordValid = isPasswordValid && confirmPassword === password;

    const submitHandler = () => {
        props.onConfirm({
            _id: props.user._id,
            password: password,
            currentPassword: currentPassword
        })
    }

    const errorLine = props.error ?
        <Alert variant="danger">{props.error}</Alert> : null

    const usernameLine = props.user.username ?
        <Form.Group as={Row} className="mb-1">
            <Form.Label column xs="2">User</Form.Label>
            <Col>
                <Form.Control readOnly plaintext defaultValue={props.user.username} />
            </Col>
        </Form.Group> : null;

    const currentPasswordControls = props.askForPassword ?
        <Form.Group controlId="currentPassword">
            <Form.Label>Current Password</Form.Label>
            <Form.Control type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)} />
        </Form.Group> : null;

    return <div>
        <Form>
            {errorLine}
            {usernameLine}
            {currentPasswordControls}
            <Form.Group controlId="password">
                <Form.Label>New Password</Form.Label>
                <Form.Control type="password"
                    value={password}
                    onChange={changePassword}
                    isValid={isPasswordValid} />
            </Form.Group>
            <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password"
                    value={confirmPassword}
                    onChange={changeConfirmPassword}
                    isValid={isConfirmedPasswordValid} />
            </Form.Group>
            <div className="d-flex flex-column flex-md-row justify-content-around">
                <Button variant="primary" onClick={submitHandler} disabled={!isConfirmedPasswordValid}>Change Password</Button>
                <Button variant="secondary" onClick={props.onCancel}>Cancel</Button>
            </div>
        </Form>
    </div>
}

PasswordChangeForm.propTypes = {
    user: PropTypes.shape({
        _id: PropTypes.string,
        username: PropTypes.string
    }),
    askForPassword: PropTypes.bool,
    onCancel: PropTypes.func
}

export default PasswordChangeForm;
