import React, { useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import axios from 'axios';

import { LoginContext } from '../../../context/login-context';
import classes from './LogoutPage.module.css';

const LogoutPage = (props) => {

    const { userId, logout } = useContext(LoginContext);

    useEffect(() => {
        logout();
    }, [logout]);

    if (!userId) {
        return <Redirect to="/campgrounds" />
    }

    return (
        <div className={classes.LogoutBox} >
            <h3>Logging out ...</h3>
            <Spinner animation="border" variant="primary" className={classes.Spinner} />
        </div>
    )
}

export default LogoutPage;
