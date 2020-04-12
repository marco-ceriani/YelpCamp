
import React from 'react';
import { LinkContainer } from 'react-router-bootstrap'
import Button from 'react-bootstrap/Button';

import classes from './LandingPage.module.css';

const LandingPage = (props) => {
    return (
        <div className={classes.LandingBody}>
            <div className={classes.LandingHeader}>
                <h1>Welcome to YelpCamp!</h1>
                <LinkContainer to="/campgrounds">
                    <Button variant="success" size="lg">View all Campgrounds</Button>
                </LinkContainer>
            </div>

            <ul className={classes.Slideshow}>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>
    );
}

export default LandingPage;
