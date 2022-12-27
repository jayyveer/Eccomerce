import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import axios from 'axios'
import * as Yup from 'yup'
import { Field, useFormik } from 'formik'
import 'antd/dist/antd.css';
import { message } from 'antd'


const Registerscreen = () => {
    //Set Initial Values
    const initialValues = {
        name: '',
        email: '',
        password: '',
        terms: false
    };
    //Validation Schema using Yup
    const signUpSchema = Yup.object().shape({
        name: Yup.string()
            .required('First Name is required')
            .max(25, 'Name cannot be longer then 25 characters'),
        email: Yup.string()
            .email('Email is invalid')
            .required('Email is required')
            .matches(/^([a-zA-Z0-9+_.-]+)(|([+])([0-9])+)@([a-zA-Z0-9.-]+)\.([a-zA_Z]{2,3}$)/, 'Email is invalid'),
        //Email will start from number or alphabet have @ then gmail type letters then . and lastly com type letters
        password: Yup.string()
            .required('Please Enter your password')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%&])(?=.{8,})/,
                "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
            ),
            // .max(25, 'Password cannot be longer than 25 characters')
            // .matches(/^(?=.{6,})/, "Must Contain 6 Characters")
            // .matches(
            //     /^(?=.*[a-z])(?=.*[A-Z])/,
            //     "Must Contain One Uppercase, One Lowercase"
            // )
            // .matches(
            //     /^(?=.*[!@#\$%\^&\*])/,
            //     "Must Contain One Special Case Character"
            // )
            // .matches(/^(?=.{6,20}$)\D*\d/, "Must Contain One Number"),
        terms: Yup.bool()
            .oneOf([true], 'Please accept terms and conditions to continue'),
    });
    //Intialise and destructure useFormik hook
    const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
        initialValues: initialValues,
        validationSchema: signUpSchema,
        onSubmit: (values) => {
            // console.log(values, "Call api here");
            registerHandler()
            //registerUser()
        }

    });



    const [user, setUser] = useState([])
    const navigate = useNavigate();
    const [navigation, setNavigation] = useState(false)

    const registerHandler = () => {
        const data = {
            name: values.name,
            email: values.email,
            password: values.password
        }
        axios.get('/users')
            .then((posRes) => {
                let flag = 0;
                // console.log(posRes.data);
                for (let i = 0; i < posRes.data.length; i++) {
                    console.log(values.email);
                    console.log(posRes.data[i].email)
                    if (values.email === posRes.data[i].email) {
                        flag = 1;
                    }
                }
                if (flag == 1) {
                    message.error('Email already Exists!')
                }
                else {
                    registerUser();
                }
            }, (errRes) => {
                console.log("Error", errRes);
            })
    }

    const registerUser = () => {
        axios.post('/users/signup', values)
            .then((posRes) => {
                navigate("/login");
                message.success("Registered!! Login to continue")
                console.log("Positive Result ", posRes);
            }, (errRes) => {
                console.log("Error", errRes);
                message.error("Please try again!!")
            })
    }

    
    return (
        <FormContainer className='py-3'>
            <h1>Register</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId='name' className='py-3'>
                    <Form.Label>Name*</Form.Label>
                    <Form.Control
                        type='text'
                        name="name" maxLength="26"
                        placeholder='Enter name'
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    ></Form.Control>
                    {errors.name && touched.name ? <span className='py-1 text-danger font-weight-bold'>{errors.name}</span> : null}
                </Form.Group>

                <Form.Group controlId='email' className='py-3'>
                    <Form.Label>Email Address*</Form.Label>
                    <Form.Control
                        type='email'
                        name="email" maxLength="35"
                        placeholder='Enter email'
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    ></Form.Control>
                    {errors.email && touched.email ? <span className='py-1 text-danger font-weight-bold'>{errors.email}</span> : null}
                </Form.Group>

                <Form.Group controlId='password' className='py-3'>
                    <Form.Label>Password*</Form.Label>
                    <Form.Control
                        type='password'
                        name="password" maxLength="26"
                        placeholder='Enter password'
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    ></Form.Control>
                    {errors.password && touched.password ? <span className='py-1 text-danger font-weight-bold'>{errors.password}</span> : null}
                </Form.Group>

                {/* <Form.Group controlId='confirmPassword' className='py-3'>
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                      type='password'
                      name="confirmpassword"
                      placeholder='Confirm password'
                    //   value={confirmPassword}
                    //   onChange={(e) => setConfirmPassword(e.target.value)}
                  ></Form.Control>
              </Form.Group> */}
                {/* <label>
                  Terms and conditions
                  <Field type="checkbox" name="termsAndConditions" />
              </label>
              {errors.termsAndConditions && <p>{errors.termsAndConditions}</p>} */}
                <Form.Group controlId='terms' className='py-3'>
                    <Form.Check
                        type='checkbox'
                        name="terms"
                        label={" Terms and conditioins"}
                        onChange={handleChange}
                    />
                    {errors.terms && touched.terms ? <span className='py-1 text-danger font-weight-bold'>{errors.terms}</span> : null}
                </Form.Group>
                <Button type='submit' variant='primary'>
                    Register
                </Button>
            </Form>

            <Row className='py-3'>
                <Col>
                    Have an Account?{' '}
                    <Link to={'/login'}>
                        Login
                    </Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default Registerscreen
