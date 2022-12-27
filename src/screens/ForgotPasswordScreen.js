import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import axios from 'axios'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import 'antd/dist/antd.css';
import { message } from 'antd'


const Loginscreen = () => {
    const navigate = useNavigate()
    //Set Initial Values
    const initialValues = {
        email: ''
    };
    //Validation Schema using Yup
    const loginSchema = Yup.object().shape({
        email: Yup.string()
            .email('Email is invalid')
            .required('Email is required')
            .matches(/^([a-zA-Z0-9]+)@([a-zA-Z]+)\.([a-zA_Z])/, 'Email is invalid')
    });
    //Intialise and destructure useFormik hook
    const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
        initialValues: initialValues,
        validationSchema: loginSchema,
        onSubmit: (values) => {
            checkUser();
        }

    });
    const checkUser = () => {
        const data = {
            email: values.email
        }
        axios.get('/users')
            .then((posRes) => {
                let flag = 0;
                for (let i = 0; i < posRes.data.length; i++) {
                    // console.log(values.email);
                    // console.log(posRes.data[i].email)
                    if (values.email === posRes.data[i].email) {
                        flag = 1;
                    }
                }
                if (flag == 1) {
                    console.log("Email Exists");
                    message.success("Email sent on registered Email address!!")
                    navigate('/link-confirmation')
                    forgotPassword()
                }
                else {
                    message.error('Email does not exist')
                }
            }, (errRes) => {
                console.log("Error", errRes);
            })
    }
    const forgotPassword = () => {
        axios.post('/users/forgot-password',values)
            .then((posRes) => {
                message.success("Email sent on registered Email address!!")
                console.log("Success");
            }, (errRes) => {
                console.log('error', errRes)
                message.error("Please check Email again")
            })
    }
    return (
        <FormContainer>
            <h1>Forgot Password</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId='email' className='py-3'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type='email'
                        name='email'
                        placeholder='Enter email'
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    ></Form.Control>
                    {errors.email && touched.email ? <h6 className='py-1 text-danger'>{errors.email}</h6> : null}
                </Form.Group>
                <Button type='submit' variant='primary' className='py-3'>
                    Send Reset Link
                </Button>
            </Form>
            <Row className='py-3'>
                <Col>
                    New Customer?{' '}
                    <Link to={'/register'}>
                        Register
                    </Link>
                </Col>
            </Row>
        </FormContainer >
    )
}

export default Loginscreen