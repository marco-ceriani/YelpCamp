import React from 'react';

import { Form } from 'react-bootstrap';

const form = props => {

    const fieldChangeHandler = (name, event) => {
        props.onChange({
            ...props.object,
            [name]: event.target.value
        })
    }

    return (
        <Form>
            {props.fields.map(({ name, type, label, ...fieldProps }) => (
                <Form.Group controlId={name}>
                    <Form.Label>{label}</Form.Label>
                    <Form.Control 
                        type={type}
                        {...fieldProps}
                        value={props.object[name]}
                        onChange={event => fieldChangeHandler(name, event)} />
                </Form.Group>
            ))}
        </Form>
    );

}

export default form;