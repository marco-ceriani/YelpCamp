import React from 'react';

import { Button } from 'react-bootstrap';

import classes from './CommentButton.module.css';

const CommentButton = props => {
    let variant = "primary";
    let icon = null;
    switch (props.variant) {
        case 'edit':
            variant = "primary";
            icon = <i class="fas fa-edit"></i>
            break;
        case 'delete':
            variant = "danger";
            icon = <i class="fas fa-trash-alt"></i>
            break;
        case 'confirm':
            variant = "success";
            icon = <i class="fas fa-check-circle"></i>
            break;
        case 'cancel':
            variant = "secondary";
            icon = <i class="fas fa-times"></i>
            break;
            
    }
    return (
        <Button size="sm" variant={variant} className={classes.Button}
            onClick={props.onClick}>{icon}</Button>
    );
}

export default CommentButton;
