import React, { useRef } from 'react';

import { Modal, Form, Button } from 'react-bootstrap';

const CommentModal = props => {

    const textAreaRef = useRef(null);

    const newCommentHandler = () => {
        props.onNewComment(textAreaRef.current.value)
    }

    return (
        <Modal
            show={props.show}
            onHide={props.onClose}
            centered
            size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Write your comment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Control ref={textAreaRef} as="textarea" rows="5" cols="70" placeholder="Write your comment ..." />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={newCommentHandler}>Sumbit</Button>
            </Modal.Footer>
        </Modal>
    );

}

export default CommentModal;
