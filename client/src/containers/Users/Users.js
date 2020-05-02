import React from 'react';
import axios from 'axios';

import { Container, Row, Col, Table, Button, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useDataFetcher, { ErrorMessage, FetchSpinner } from '../../hooks/data-fetcher';
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

const Users = () => {

    const [{ data, isLoading, error }, { setData }] = useDataFetcher('/rest/users', { users: [] });

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

    return <Container>
        <Row>
            <Col>
                <h3 className="text-center">Registered users</h3>
            </Col>
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
                                        <Button size="sm" variant="warning" onClick={() => lockUnlockUser(user)}>
                                        <i className="fas fa-ban"></i>
                                        </Button>
                                        <Button size="sm" variant="danger" onClick={() => deleteUser(user)}>
                                            <i className="fas fa-trash-alt"></i>
                                        </Button>
                                    </ButtonGroup>
                                </td>
                            </tr>))}
                    </tbody>

                </Table>
            </Col>
        </Row>
    </Container>
}

export default Users;
