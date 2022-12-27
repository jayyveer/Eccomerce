import React from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'

const SubmitForm = () => {
    return (
        <Form>
            <Row>
                <Col>
                    <Form.Control
                        type='text'
                        autoComplete='off'
                        name='search'
                        placeholder='Search Products...'
                        className='mr-sm-2 ml-sm-5'
                    ></Form.Control>
                </Col>
                <Col xs="auto">
                    <Button type="submit" className="mb-2">
                        Submit
                    </Button>
                </Col>
            </Row>
        </Form>
    )
}

export default SubmitForm
