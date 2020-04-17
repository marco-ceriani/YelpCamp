import React, { useContext } from 'react';

import { Navbar, Nav, Container } from 'react-bootstrap';
import NavbarLink from '../NavbarLink/NavbarLink';

import { LoginContext } from '../../../context/login-context';
import UserButton from '../UserButton/UserButton';

const Toolbar = props => {

    const authContext = useContext(LoginContext);

    let rightMenuItems = [
        <NavbarLink to="/login" key="login">Login</NavbarLink>,
        <NavbarLink to="/register" key="register">Sign Up</NavbarLink>
    ];
    if (authContext && authContext.userId) {
        rightMenuItems = [
            <NavbarLink to="/profile" key="profile">
                <UserButton name={authContext.name} avatar={authContext.avatar} />
            </NavbarLink >,
            <NavbarLink to="/logout" key="logout">Logout</NavbarLink>,
        ];
    }

    return (
        <Navbar bg="dark" variant="dark" expand="md" className="mb-3">
            <Container>
                <NavbarLink type="brand" to="/">YelpCamp</NavbarLink>
                <Navbar.Toggle aria-controls="the-navbar-collapse" />
                <Navbar.Collapse id="the-navbar-collapse">
                    <Nav className="mr-auto">
                        <NavbarLink to="/campgrounds" exact>Home</NavbarLink>
                    </Nav>
                    <Nav>
                        {rightMenuItems}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Toolbar;