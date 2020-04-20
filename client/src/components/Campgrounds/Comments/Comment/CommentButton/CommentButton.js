import React from 'react';

import { Button } from 'react-bootstrap';

import classes from './CommentButton.module.css';

const CommentButton = props => {
    let variant = "primary";
    let icon = null;
    switch (props.variant) {
        case 'edit':
            variant = "primary";
            icon = <i className="fas fa-edit"></i>
            break;
        case 'delete':
            variant = "danger";
            icon = <i className="fas fa-trash-alt"></i>
            break;
        case 'confirm':
            variant = "success";
            icon = <i className="fas fa-check-circle"></i>
            break;
        case 'cancel':
            variant = "secondary";
            icon = <i className="fas fa-times"></i>
            break;
            
    }
    return (
        <Button size="sm" variant={variant} className={classes.Button}
            onClick={props.onClick}>{icon}</Button>
    );
}

export default CommentButton;
