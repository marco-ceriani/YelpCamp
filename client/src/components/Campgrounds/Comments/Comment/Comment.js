import React, { useState, useRef } from 'react';
import moment from 'moment';

import { ListGroup, Button, Form } from 'react-bootstrap';

import classes from './Comment.module.css';

const Comment = props => {

    const { comment, canUpdate } = props;

    const [editing, setEditing] = useState(false);
    const [currentComment, setCurrentComment] = useState(comment.text);
    const textAreaRef = useRef(null);

    const commentHeader = (
        <div className="d-flex justify-content-between mb-1">
            <strong className={classes.AuthorName}>{comment.author.username}</strong>
            <span>{moment(comment.createdAt).fromNow()}</span>
        </div>
    );

    const editHandler = () => {
        setCurrentComment(textAreaRef.current.value);
    }

    const editUndoHandler = () => {
        setCurrentComment(comment.text);
        setEditing(false);
    }

    const editConfirmHandler = () => {
        const newComment = {
            ...comment,
            text: textAreaRef.current.value
        }
        props.onCommentUpdate(newComment);
        setEditing(false);
    }

    if (!canUpdate) {
        return (
            <ListGroup.Item>
                {commentHeader}
                <div>{currentComment}</div>
            </ListGroup.Item>
        )
    } else if (!editing) {
        return (
            <ListGroup.Item>
                {commentHeader}
                <div>{currentComment}</div>
                <Button size="sm" variant="primary" className={classes.Button}
                    onClick={() => setEditing(true)}><i class="fas fa-edit"></i></Button>
                <Button size="sm" variant="danger" className={classes.Button}
                    onClick={() => props.onCommentDelete(comment._id)}><i class="fas fa-trash-alt"></i></Button>
            </ListGroup.Item>
        )
    } else {
        return (
            <ListGroup.Item>
                <Form.Control ref={textAreaRef} as="textarea" rows="5" cols="70" className="mb-1"
                    value={currentComment} onChange={editHandler} />
                <Button size="sm" variant="secondary" className={classes.Button}
                    onClick={editUndoHandler}><i class="fas fa-times"></i></Button>
                <Button size="sm" variant="success" className={classes.Button}
                    onClick={editConfirmHandler}><i class="fas fa-check-circle"></i></Button>
            </ListGroup.Item>
        )
    }


}

export default Comment;
