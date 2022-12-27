import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import axios from 'axios'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import 'antd/dist/antd.css';
import { message } from 'antd'

const Loginscreen = () => {
    const location = useLocation();
    const productId = location?.state?.productId
    // console.log("Product Id recieved or not check",productId);
    // const checkuser = JSON.parse(localStorage.getItem('user')) || {}
    const checkuser = JSON.parse(localStorage.getItem('user'))
    const [user, setUser] = useState({})
    const [check, checkStatus] = useState(false)
    const navigate = useNavigate()
    const [navigation, setNavigation] = useState(false)
    useEffect(() => {
        console.log(checkuser, 'inside useEffect')
        if (checkuser == null) {

        }
        else {
            navigate('/')
        }
    },)
    //Set Initial Values
    const initialValues = {
        email: '',
        password: ''
    };
    //Validation Schema using Yup
    const loginSchema = Yup.object().shape({
        email: Yup.string()
            .email('Email is invalid')
            .required('Email is required')
            .matches(/^([a-zA-Z0-9]+)@([a-zA-Z]+)\.([a-zA_Z])/, 'Email is invalid'),
        //Email will start from number or alphabet have @ then gmail type letters then . and lastly com type letters,
        password: Yup.string()
            .required('Password is required')
    });
    //Intialise and destructure useFormik hook
    const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
        initialValues: initialValues,
        validationSchema: loginSchema,
        onSubmit: (values) => {
            console.log(values, "Form Values");
            // loginhandler(values)
            loginUser()
        }

    });


    const loginhandler = (values) => {
        let obj = {
            email: values.email,
            password: values.password
        }
        console.log("User Data", obj);
        checkStatus(true)
        setUser(obj)
        setNavigation(true)
    }

    const loginUser = () => {
        console.log("ChEck state", check);
        // debugger
        axios.post('/users/login', values)
            .then((posRes) => {
                console.log(posRes.data.user_id, "data");
                
                localStorage.setItem("user", JSON.stringify(posRes.data))
                localStorage.setItem("userId", posRes.data.user_id)
                localStorage.setItem("token", posRes.data.token)
                //navigate('/')
                if (!productId) {
                    navigate('/')
                }
                else {
                    navigate(`/product/${productId}`)
                }
                window.location.reload(true);
                message.success('Successfully Logged in');
                //navigation ? navigate('/') : null
            }, (errRes) => {
                console.log('error', errRes)
                message.error("Please check Email or Password again")
            })
    }

    return (
    checkuser == null ?
            (<FormContainer>
                <h1>Log In</h1>
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

                    <Form.Group controlId='password' className='py-3'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type='password'
                            name='password'
                            placeholder='Enter password'
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        ></Form.Control>
                        {errors.password && touched.password ? <h6 className='py-1 text-danger'>{errors.password}</h6> : null}
                    </Form.Group>
                    <Form.Group controlId='remember' className='pb-3 '>
                        <Form.Check
                            type='checkbox'
                            name="rememeber"
                            defaultChecked={true}
                            label={" Remember Me"}
                        />
                    </Form.Group>
                    <Button type='submit' variant='primary' className='py-3'>
                        Log In
                    </Button>
                </Form>
                <Row className='py-3'>
                    <Col>
                        <Link to={'/forgot-password'}>
                            Forgot Password
                        </Link>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        New Customer?{' '}
                        <Link to={'/register'}>
                            Register
                        </Link>
                    </Col>
                </Row>
            </FormContainer >

            ) : (
                <div>
                   <h1>You are already logged in</h1>
                </div>
            )


        
    )
}

export default Loginscreen
