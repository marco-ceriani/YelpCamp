import React from 'react';

import classes from './UserButton.module.css';

const UserButton = props => {
    return (
        <>
            <img src={props.avatar} alt="avatar" className={classes.ProfileImage} />
            {props.name}
        </>);
}

export default UserButton;
