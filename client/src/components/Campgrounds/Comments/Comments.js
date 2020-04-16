import React, { useState, useContext } from 'react';
import moment from 'moment';

import { ListGroup, Card, Button } from 'react-bootstrap';

import classes from './Comments.module.css';
import CommentModal from './CommentModal/CommentModal';
import Comment from './Comment/Comment';
import { LoginContext } from '../../../context/login-context';

const Comments = props => {

    const [commenting, setCommenting] = useState(false);

    const authContext = useContext(LoginContext);

    const newCommentHandler = (comment) => {
        props.onNewComment(comment)
            .then(resp => {
                setCommenting(false);
            });
    }

    const canUpdateComment = (comment) => {
        return authContext.userId === comment.author.id
    }

    let commentsList = <em className="text-muted">No comments yet.</em>
    if (props.comments) {
        commentsList = (
            <ListGroup variant="flush">
                {props.comments.map(comment => (
                    <Comment
                        key={comment._id}
                        comment={comment}
                        canUpdate={canUpdateComment(comment)}
                        onCommentDelete={props.onCommentDelete}
                        onCommentUpdate={props.onUpdateComment}
                    />
                ))}
            </ListGroup>
        );
    }

    return (
        <Card>
            <Card.Header className="d-flex justify-content-between">
                <Card.Title className={classes.Title}>User comments</Card.Title>
                <Button
                    variant="success"
                    size="sm"
                    onClick={() => setCommenting(true)}
                    disabled={!authContext.userId}
                ><i className="fas fa-plus mr-1"></i>Add new Comment</Button>
            </Card.Header>
            {commentsList}
            <CommentModal
                show={commenting}
                onClose={() => setCommenting(false)}
                onNewComment={newCommentHandler}
            />
        </Card>
    );
}

export default Comments;
