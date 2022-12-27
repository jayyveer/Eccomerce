
import axios from 'axios'
import { Button, Form, ListGroup, Image } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useFormik } from 'formik'
import { message, List,Row, Col } from 'antd'

const ProfileScreen = () => {
    const userId = parseInt(localStorage.getItem("userId"))
    const [cartItems, setCartItems] = useState()
    const [userData, setUserData] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    //token and authorization in header
    const token = localStorage.getItem("token")
    const config = {
        headers: {
            'Authorization': token
        }
    };
    
    
   
    const changePassword = () => {
        //API call to change password from backend
        axios.post(`/users/reset-password/${userData.email}`, values, config)
            .then((posRes) => {
                message.success("Password Successfully changed.")
                console.log("Password Changed Successfully");
                navigate('/')
            }, (errRes) => {
                console.log('error', errRes)
                message.error("Cannot Change Password")
            })
    }
    
    const initialValues = {
        name: '',
        email: '',
        password: '',
        cpassword: ''
    };
    //Validation Schema using Yup
    const updateSchema = Yup.object().shape({
        name: Yup.string()
            .required('First Name is required')
            .max(25, 'Name cannot be longer then 25 characters'),
        email: Yup.string()
            .email('Email is invalid')
            .required('Email is required')
            .matches(/^([a-zA-Z0-9]+)(|([+])([0-9])+)@([a-zA-Z]+)\.([a-zA_Z])/, 'Email is invalid'),
        //Email will start from number or alphabet have @ then gmail type letters then . and lastly com type letters
        password: Yup.string()
            .required('Please Enter your password')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%&])(?=.{8,})/,
                "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
            ),
        cpassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required')

    });
    //Intialise and destructure useFormik hook
    const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
        initialValues: initialValues,
        validationSchema: updateSchema,
        onSubmit: (values) => {
            changePassword()
        }

    });
    useEffect(() => {
        const fetchProduct = async () => {
            const { data } = await axios.get(`/users/${userId}`)
            // const { orderData } = await axios.get(`/user/order/${userId}`)
            // console.log("orderhistory Data",orderData);
            // setCartItems(orderData)
            Object.assign(values, data[0])
            values.password = ''
            setUserData(data[0])
            // console.log(product.title);
            setLoading(false)
        }
        const fetchOrderHistory = async () => {
            axios.get(`users/order/${userId}`)
                .then((posRes) => {
                     Object.assign(values, userData)
                    setCartItems(posRes.data)
                }, (errRes) => {
                    console.log("Error", errRes);
                });
        }
        fetchProduct()
        fetchOrderHistory()
    }, [])
    return (
        
        <Row>
            {console.log(values) }
            
            <Col md={7} className='mr-3'>
                <h2>User Profile</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId='name' className='py-3'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            name='name'
                            type='name'
                            placeholder='Enter name'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.name}
                        ></Form.Control>
                        {errors.name && touched.name ? <span className='py-1 text-danger font-weight-bold'>{errors.name}</span> : null}
                    </Form.Group>

                    <Form.Group controlId='email' className='py-3'>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='Enter email'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                        ></Form.Control>
                        {errors.email && touched.email ? <span className='py-1 text-danger font-weight-bold'>{errors.email}</span> : null}
                    </Form.Group>

                    <Form.Group controlId='password' className='py-3'>
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Enter password'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                        ></Form.Control>
                        {errors.password && touched.password ? <span className='py-1 text-danger font-weight-bold'>{errors.password}</span> : null}

                    </Form.Group>

                    <Form.Group controlId='cPassword' className='py-3'>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type='password'
                            name='cpassword'
                            placeholder='Confirm password'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.confirmPassword}
                        ></Form.Control>
                        {errors.cpassword && touched.cpassword ? <span className='py-1 text-danger font-weight-bold'>{errors.cpassword}</span> : null}
                    </Form.Group>

                    <Button type='submit' variant='primary'>
                        Update
                    </Button>
                </Form>
            </Col>
            <Col md={16}>
                <h2>Order History</h2>
                {/* <ListGroup variant='flush'>
                    {cartItems && cartItems.map((item) => (
                        <ListGroup.Item key={item.product_id} >
                            <Row className="d-flex align-items-center">
                                <Col md={2}>
                                    <Image src={item.thumbnail} alt={item.name} fluid rounded />
                                </Col>
                                <Col md={3}>
                                    <Link to={`/product/${item.product_id}`}>{item.title}-{item.discription}</Link>
                                </Col>
                                <Col md={1}>Rs.{item.price}</Col>
                                <Col md={2}>
                                    {item.bought_on.substring(0, 10)}
                                </Col>
                                <Col md={1}>
                                    {item.qty}
                                </Col>
                                <Col md={3}>
                                <Button>
                                    <Link to={`/product/${item.product_id}`}>Buy Again</Link>
                                </Button>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    ))}
                </ListGroup> */}
                <List
                    pagination={{
                        onChange: page => {
                            // console.log(page);
                        },
                        pageSize: 4,
                    }}
                    dataSource={cartItems}
                    renderItem={item => (
                        <List.Item>
                            {/* <List.Item.Meta
                            
                                thumbnail={item.thumbnail}
                                title={item.title}
                                description={item.discription}
                                price={item.price}
                            />
                            <Image src={item.thumbnail} alt={item.name} fluid rounded />
                            {item.price} */}
                            <Row className="d-flex align-items-center">
                                <Col md={3} className='align-items-center'>
                                    <Image src={item.thumbnail} alt={item.name} fluid rounded />
                                </Col>
                                <Col md={6} className='align-items-center m-2'>
                                    <Link to={`/product/${item.product_id}`}>{item.title}-{item.discription}</Link>
                                </Col>
                                <Col md={3}>Rs.{item.price}</Col>
                                <Col md={4}>
                                    {item.bought_on.substring(11,16)}
                                    {" "}
                                    {item.bought_on.substring(0, 10)}
                                </Col>
                                <Col md={2}>
                                    <center>{item.qty}</center>
                                </Col>
                                <Col md={4}>
                                    <Button>
                                        <Link to={`/product/${item.product_id}`}>Buy Again</Link>
                                    </Button>
                                </Col>
                            </Row>
                        </List.Item>
                    )}
                />
            </Col>
        </Row>
    )
}

export default ProfileScreen
