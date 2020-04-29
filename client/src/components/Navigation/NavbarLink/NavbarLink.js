import React from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

const NavbarLink = props => {
    const {children, ...rest} = props;
    switch (props.type) {
        case "brand":
            return <Navbar.Brand as={NavLink} {...rest}>{children}</Navbar.Brand>
        default:
            return <Nav.Link as={NavLink} {...rest}>{children}</Nav.Link>
    }
}

export default NavbarLink;
