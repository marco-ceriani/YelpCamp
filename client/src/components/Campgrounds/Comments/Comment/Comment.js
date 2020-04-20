import React, { useState, useRef, useEffect } from 'react';
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
    const textAreaRef = useRef(null);

    useEffect(() => {
        if (!editing) {
            setCurrentComment(comment.text);
        }
    }, [editing]);

    const editHandler = () => {
        setCurrentComment(textAreaRef.current.value);
    }

    const editUndoHandler = () => {
        setCurrentComment(comment.text);
        onCommentCancel();
    }

    const editConfirmHandler = () => {
        onCommentUpdate({
            ...comment,
            text: textAreaRef.current.value
        });
    }

    if (editing) {
        return (
            <ListGroup.Item>
                <Form.Control ref={textAreaRef} as="textarea" rows="5" cols="70" className="mb-1"
                    value={currentComment} onChange={editHandler} />
                <CommentButton variant="cancel" onClick={editUndoHandler} />
                <CommentButton variant="confirm" onClick={editConfirmHandler} />
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
