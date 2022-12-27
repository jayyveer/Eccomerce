import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import axios from 'axios'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import 'antd/dist/antd.css';
import { message } from 'antd'

const ResetPasswordScreen = () => {
    const navigate = useNavigate()
    const {email} = useParams();
    //Set Initial Values
    const initialValues = {
        password: '',
        confirmpassword: ''
    };
    //Validation Schema using Yup
    const resetSchema = Yup.object().shape({
        password: Yup.string()
            .required('Please Enter your password')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%&])(?=.{8,})/,
                "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
            ),
        confirmpassword:Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required')

    });
    //Intialise and destructure useFormik hook
    const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
        initialValues: initialValues,
        validationSchema: resetSchema,
        onSubmit: (values) => {
            changePassword();
        }

    });
    const changePassword = () => {
        //API call to change password from backend
        axios.post(`/users/reset-password/${email}`, values)
            .then((posRes) => {
                message.success("Password Successfully changed.")
                console.log("Password Changed Successfully");
                navigate('/login')
            }, (errRes) => {
                console.log('error', errRes)
                message.error("Cannot Change Password")
            })
    }
  return (
      <FormContainer>
          <h1>Reset Password</h1>
          <Form onSubmit={handleSubmit}>
              <Form.Label>Email - {email}</Form.Label>
              <Form.Group controlId='password' className='py-3'>
                  <Form.Label>Enter Password</Form.Label>
                  <Form.Control
                      type='password'
                      name='password'
                      placeholder='Enter New Password'
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                  ></Form.Control>
                  {errors.password && touched.password ? <h6 className='py-1 text-danger'>{errors.password}</h6> : null}
              </Form.Group>
              <Form.Group controlId='confirmpassword' className='py-3'>
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                      type='password'
                      name="confirmpassword"
                      maxLength="15"
                      placeholder='Re-enter password'
                      value={values.confirmpassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                  ></Form.Control>
                  {errors.confirmpassword && touched.confirmpassword ? <h6 className='py-1 text-danger'>{errors.confirmpassword}</h6> : null}
              </Form.Group>
              <Button type='submit' variant='primary' className='py-3'>
                Change Password
              </Button>
          </Form>
      </FormContainer >
  )
}

export default ResetPasswordScreen
