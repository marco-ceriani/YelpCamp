import React, { useState, useRef } from 'react';
import moment from 'moment';

import { ListGroup, Form } from 'react-bootstrap';

import classes from './Comment.module.css';
import CommentButton from './CommentButton/CommentButton';

const CommentHeader = props => {
    return (
        <div className="d-flex justify-content-between mb-1">
            <strong className={classes.AuthorName}>{props.author.username}</strong>
            <span>{moment(props.createdAt).fromNow()}</span>
        </div>
    );
}

const Comment = props => {

    const { comment, canUpdate } = props;

    const [editing, setEditing] = useState(false);
    const [currentComment, setCurrentComment] = useState(comment.text);
    const textAreaRef = useRef(null);

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
                <CommentHeader {...comment} />
                <div>{currentComment}</div>
            </ListGroup.Item>
        )
    } else if (!editing) {
        return (
            <ListGroup.Item>
                <CommentHeader {...comment} />
                <div>{currentComment}</div>
                <CommentButton variant="edit" onClick={() => setEditing(true)} />
                <CommentButton variant="delete" onClick={() => props.onCommentDelete(comment._id)} />
            </ListGroup.Item>
        )
    } else {
        return (
            <ListGroup.Item>
                <Form.Control ref={textAreaRef} as="textarea" rows="5" cols="70" className="mb-1"
                    value={currentComment} onChange={editHandler} />
                <CommentButton variant="cancel" onClick={editUndoHandler} />
                <CommentButton variant="confirm" onClick={editConfirmHandler} />
            </ListGroup.Item>
        )
    }

}

export default Comment;
