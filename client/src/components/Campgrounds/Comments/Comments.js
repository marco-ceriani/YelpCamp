import React from 'react';
import moment from 'moment';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

const Comments = props => {

    let commentsList = <em className="text-muted">No comments yet.</em>
    if (props.comments) {
        commentsList = (
            <ListGroup variant="flush">
                {props.comments.map(comment => (
                    <ListGroup.Item key={comment._id}>
                        <div className="d-flex justify-content-between">
                            <strong><i className="fas fa-user mr-2"></i>{comment.author.username}</strong>
                            <span>{moment(comment.createdAt).fromNow()}</span>
                        </div>
                        <p>{comment.text}</p>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        );
    }

    return (
        <Card>
            <Card.Header className="d-flex justify-content-between">
                <Card.Title>User comments <i className="fas fa-comment-alt ml-1"></i></Card.Title>
                <Button variant="success" size="sm"><i className="fas fa-plus mr-1"></i>Add new Comment</Button>
            </Card.Header>
            {commentsList}
        </Card>
    );
}

export default Comments;
