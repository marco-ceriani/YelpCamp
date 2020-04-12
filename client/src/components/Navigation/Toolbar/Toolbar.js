import React from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavbarLink from '../NavbarLink/NavbarLink';

const Toolbar = props => {

    let authInfo = null;
    //authInfo = {name: "Carmelo"}

    let rightMenuItems = [
        <NavbarLink to="/login" key="login">Login</NavbarLink>,
        <NavbarLink to="/register" key="register">Sign Up</NavbarLink>
    ];
    if (authInfo) {
        rightMenuItems = [
            <NavbarLink to="/profile">{authInfo.name}</NavbarLink>,
            <NavbarLink to="/logout">Logout</NavbarLink>
        ];
    }

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
            <NavbarLink type="brand" to="/">YelpCamp</NavbarLink>
            <Navbar.Toggle aria-controls="the-navbar-collapse" />
            <Navbar.Collapse id="the-navbar-collapse">
                <Nav className="mr-auto">
                    <NavbarLink to="/campgrounds">Home</NavbarLink>
                </Nav>
                <Nav>
                    {rightMenuItems}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Toolbar;
