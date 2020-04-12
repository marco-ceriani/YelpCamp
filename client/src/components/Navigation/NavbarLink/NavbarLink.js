import React from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

const NavbarLink = props => {
    switch (props.type) {
        case "brand":
            return <Navbar.Brand as={NavLink} to={props.to}>{props.children}</Navbar.Brand>
        default:
            return <Nav.Link as={NavLink} to={props.to}>{props.children}</Nav.Link>
    }
}

export default NavbarLink;
