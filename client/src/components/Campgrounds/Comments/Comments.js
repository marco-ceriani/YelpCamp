import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import { ListGroup, Card, Button } from 'react-bootstrap';

import classes from './Comments.module.css';
import Comment from './Comment/Comment';
import { LoginContext } from '../../../context/login-context';

const Comments = props => {

    const { campId } = props;
    const [comments, setComments] = useState([]);
    const [editing, setEditing] = useState(null);

    const authContext = useContext(LoginContext);

    useEffect(() => {
        axios.get(`/rest/campgrounds/${campId}/comments`)
            .then(resp => {
                const { comments } = resp.data;
                setComments(comments);
            });
    }, [campId]);

    const canUpdateComment = (comment) => {
        return authContext.id === comment.author.id
    }

    const editCommentHandler = (commentId) => {
        setEditing(commentId);
    }

    const newCommentHandler = (comment) => {
        return axios.post(`/rest/campgrounds/${campId}/comments`, {
            text: comment.text
        }).then(resp => {
            const newComment = resp.data;
            setComments([newComment, ...comments]);
            return newComment;
        }).then(resp => {
            setEditing(null);
        })
    }

    const cancelEditHandler = () => {
        setEditing(null);
    }

    const updateCommentHandler = (comment) => {
        return axios.put(`/rest/campgrounds/${campId}/comments/${comment._id}`, comment)
            .then(resp => {
                const updatedComment = resp.data;
                setComments(comments.map(c => c._id === updatedComment._id ? updatedComment : c));
                return updatedComment;
            }).then(resp => {
                setEditing(null);
            })
    }

    const deleteCommentHandler = (commentId) => {
        return axios.delete(`/rest/campgrounds/${campId}/comments/${commentId}`)
            .then(resp => {
                setComments(comments.filter(cm => cm._id !== commentId));
            })
    }

    const newComment = {
        _id: '_NEW_',
        author: {_id: null, name: null},
        text: ''
    }

    return (
        <Card>
            <Card.Header className="d-flex justify-content-between">
                <Card.Title className={classes.Title}>User comments</Card.Title>
                <Button
                    variant="success"
                    size="sm"
                    onClick={() => setEditing('_NEW_')}
                    disabled={!authContext.isAuthenticated()}
                ><i className="fas fa-plus mr-1"></i>Add new Comment</Button>
            </Card.Header>
            <ListGroup variant="flush">
                {('_NEW_' === editing) && <Comment key='_NEW_'
                    comment={newComment}
                    editable={false}
                    editing={'_NEW_' === editing}
                    onCommentUpdate={newCommentHandler}
                    onCommentCancel={cancelEditHandler}
                />}
                {comments.map(comment => (
                    <Comment key={comment._id}
                        comment={comment}
                        editable={canUpdateComment(comment)}
                        editing={comment._id === editing}
                        onCommentEdit={editCommentHandler}
                        onCommentDelete={deleteCommentHandler}
                        onCommentUpdate={updateCommentHandler}
                        onCommentCancel={cancelEditHandler}
                    />
                ))}
            </ListGroup>
        </Card>
    );
}

export default Comments;
