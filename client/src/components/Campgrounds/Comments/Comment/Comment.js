import React, { useState, useEffect } from 'react';
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

    const { comment, editable, editing, onCommentEdit, onCommentUpdate, onCommentCancel } = props;

    const [currentComment, setCurrentComment] = useState(comment.text);

    useEffect(() => {
        if (!editing) {
            setCurrentComment(comment.text);
        }
    }, [editing, comment.text]);

    const editHandler = (value) => {
        setCurrentComment(value);
    }

    const editUndoHandler = () => {
        setCurrentComment(comment.text);
        onCommentCancel();
    }

    const editConfirmHandler = (value) => {
        onCommentUpdate({
            ...comment,
            text: currentComment
        });
    }

    if (editing) {
        return (
            <ListGroup.Item>
                <Form.Control as="textarea" rows="5" cols="70" className="mb-1"
                    value={currentComment} onChange={event => editHandler(event.target.value)} />
                <CommentButton variant="cancel" onClick={editUndoHandler} />
                <CommentButton variant="confirm" onClick={event => editConfirmHandler(event.target.value)} />
            </ListGroup.Item>
        )
    } else if (editable) {
        return (
            <ListGroup.Item>
                <CommentHeader {...comment} />
                <div>{currentComment}</div>
                <CommentButton variant="edit" onClick={() => onCommentEdit(comment._id)} />
                <CommentButton variant="delete" onClick={() => props.onCommentDelete(comment._id)} />
            </ListGroup.Item>
        )
    } else {
        return (
            <ListGroup.Item>
                <CommentHeader {...comment} />
                <div>{currentComment}</div>
            </ListGroup.Item>
        )
    }

}

export default Comment;
