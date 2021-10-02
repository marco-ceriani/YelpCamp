import React from 'react';
import axios from 'axios';

import { useState, useEffect } from 'react';
import {
    Container, Row, Col, Form, Table, Button, ButtonGroup, InputGroup,
    OverlayTrigger, Tooltip, Modal
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PasswordChangeForm from '../../components/Users/PasswordChange';
import useDataFetcher, { } from '../../hooks/data-fetcher';
import classes from './Users.module.css';

const iconClass = (user) => {
    if (user.disabled) {
        return classes.Disabled
    }
    if (user.role === 'ADMIN') {
        return classes.Admin
    }
    return classes.User;
}

const justifyContentEvenly = {
    justifyContent: 'space-evenly'
}

const USERS_API = '/rest/users';

const UserButton = (props) => {
    const button = <Button size="sm" variant={props.variant || "primary"} onClick={props.onClick}>
        <i className={props.icon}></i>
    </Button>
    if (props.tooltip) {
        return <OverlayTrigger overlay={<Tooltip>{props.tooltip}</Tooltip>}>
            {button}
        </OverlayTrigger>
    } else {
        return button
    }
}

const Users = () => {

    const [{ data, isLoading, error }, { setData, fetchData }] = useDataFetcher(USERS_API, { users: [] });

    const [filter, setFilter] = useState('');
    const [selectedUser, setPasswordModalUser] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            let query = '';
            if (filter) {
                query = '?filter=' + filter
            }
            fetchData(USERS_API + query);
        }, 700);

        return () => {
            clearTimeout(timer)
        }
    }, [filter, fetchData]);

    const lockUnlockUser = async (user) => {
        const resp = await axios.patch(`/rest/users/${user._id}/status`, {
            enable: user.disabled ? true : false
        })
        const newUsers = data.users.map(usr => usr._id === user._id ? resp.data : usr);
        setData({ users: newUsers });
    }

    const deleteUser = async user => {
        const resp = await axios.delete(`/rest/users/${user._id}`)
        const newUsers = data.users.filter(usr => usr._id !== resp.data._id);
        setData({ users: newUsers });
    }

    const openPasswordModal = (user) => {
        setPasswordModalUser({ _id: user._id, username: user.username });
    }

    const closePasswordModal = () => {
        setPasswordModalUser(null);
    }

    const changePassword = async ({_id, password}) => {
        await axios.patch(`/rest/users/${_id}/password`, {
            newPassword: password
        })
        closePasswordModal();
    }

    return <Container>
        <Row>
            <Col>
                <h3 className="text-center">Registered users</h3>
            </Col>
        </Row>
        <Row className="d-flex mt-2 mb-4" style={justifyContentEvenly}>
            <InputGroup className="w-75">
                <InputGroup.Text id="user-filter"><i className="fas fa-search"></i></InputGroup.Text>
                <Form.Control placeholder="filter" aria-label="filter" onChange={event => setFilter(event.target.value)}></Form.Control>
            </InputGroup>
            <Button variant="primary"><i className="fas fa-plus"></i></Button>
        </Row>
        <Row>
            <Col>
                <Table striped>
                    <thead>
                        <tr>
                            <th scope="col">Username</th>
                            <th scope="col">Full Name</th>
                            <th scope="col">Role</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.users.map(user => (
                            <tr key={user._id}>
                                <td className={iconClass(user)}><Link to={`/users/${user._id}`}>{user.username}</Link></td>
                                <td>{user.fullName}</td>
                                <td>{user.role}</td>
                                <td>
                                    <ButtonGroup>
                                        <UserButton variant="warning" icon="fas fa-ban"
                                            tooltip="Ban User"
                                            onClick={() => lockUnlockUser(user)} />
                                        <UserButton variant="danger" icon="fas fa-trash-alt"
                                            tooltip="Delete User"
                                            onClick={() => deleteUser(user)} />
                                        <UserButton icon="fas fa-key"
                                            tooltip="Change Password"
                                            onClick={() => openPasswordModal(user)} />
                                    </ButtonGroup>
                                </td>
                            </tr>))}
                    </tbody>

                </Table>
            </Col>
        </Row>
        <Modal show={selectedUser != null}
            onHide={() => setPasswordModalUser(null)}
            centered>
            <Modal.Header>
                <Modal.Title>Change Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <PasswordChangeForm
                    user={selectedUser}
                    onConfirm={changePassword}
                    onCancel={closePasswordModal} />
            </Modal.Body>
        </Modal>
    </Container>
}

export default Users;
