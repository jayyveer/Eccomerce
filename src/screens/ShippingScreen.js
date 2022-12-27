import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, ListGroup } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import * as Yup from 'yup'
import { Field, useFormik } from 'formik'
import 'antd/dist/antd.css';
import { Card, message, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';


const ShippingScreen = () => {
    const userId = parseInt(localStorage.getItem("userId"))
    const [shippingState, setShippingState] = useState(1)
    const token = localStorage.getItem("token")
    const config = {
        headers: {
            'Authorization': token
        }
    };
    //Set Initial Values
    const initialValues = {
        address: '',
        city: '',
        pincode: '',
        country: 'India'
    };
    //Validation Schema using Yup
    const shippingSchema = Yup.object().shape({
        address: Yup.string()
            .required('Address is required')
            .max(50, 'Address cannot be this long'),
        city: Yup.string()
            .max(20, 'City cannot be this long')
            .required('City is required'),

        pincode: Yup.number()
            .required('Pincode is required'),
        country: Yup.string()
            .required('Country cannot be empty')
    });
    //Intialise and destructure useFormik hook
    const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
        initialValues: initialValues,
        validationSchema: shippingSchema,
        onSubmit: (values) => {
            showConfirm()
            // setShippingState(0)
            // console.log(values);
            // handleOrder()
        }

    });

    const handleOrder = () => {
        //Post data to orderhistory
        for (let i = 0; i < cartItems.length; i++) {
            axios.post('users/order', cartItems[i], config)
                .then((posRes) => {
                    console.log("Data stored in order history table");
                }, (errRes) => {
                    console.log('Data not stored in order history table', errRes)
                })
        }

        //Delete all cart data
        axios.delete(`users/cart/delete/${userId}`,{ data: {}, headers: { "Authorization": token } })
            .then(() => {
                console.log("Delete succesfull");
                message.success('Order Confirmed')
            }, (errRes) => {
                console.log("Error", errRes);
            });
        setShippingState(0)
        console.log(values);
    }

    const { confirm } = Modal;
    const showConfirm = () => {
        confirm({
            title: 'Confirm Order?',
            icon: <ExclamationCircleOutlined />,
            content: 'Pressing OK will confirm your order',
            onOk() {
                console.log('OK');

                handleOrder()//delete all cart data
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };
    const handleCheckout = () => {
        //1 fetch cart details
        //2 delete cart details
    }
    const location = useLocation();
    const total = location.state.total
    const cartItems = location.state.cartItems
    return (
        shippingState ? (
            <FormContainer className='py-3'>
                <h1>Add Shipping Details</h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId='address' className='py-3'>
                        <Form.Label>Address*</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="address" maxLength="55"
                            placeholder='Enter your Address'
                            value={values.address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        ></Form.Control>
                        {errors.address && touched.address ? <span className='py-1 text-danger font-weight-bold'>{errors.address}</span> : null}
                    </Form.Group>

                    <Form.Group controlId='city' className='py-3'>
                        <Form.Label>City*</Form.Label>
                        <Form.Control
                            type='text'
                            name="city" maxLength="20"
                            placeholder='Enter City'
                            value={values.city}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        ></Form.Control>
                        {errors.city && touched.city ? <span className='py-1 text-danger font-weight-bold'>{errors.city}</span> : null}
                    </Form.Group>

                    <Form.Group controlId='pincode' className='py-3'>
                        <Form.Label>Pincode*</Form.Label>
                        <Form.Control
                            type='number'
                            name="pincode" maxLength="6"
                            placeholder='Enter Postal Code'
                            value={values.pincode}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        ></Form.Control>
                        {errors.pincode && touched.pincode ? <span className='py-1 text-danger font-weight-bold'>{errors.pincode}</span> : null}
                    </Form.Group>
                    <Form.Group controlId='country' className='py-3'>
                        <Form.Label>Country*</Form.Label>

                        <Form.Control
                            disabled
                            type='string'
                            name="country" maxLength="15"
                            placeholder='Enter Country'
                            value={values.country}
                        ></Form.Control>
                    </Form.Group>

                    {/* <Form.Group controlId='checkbox' className='py-3'>
                        <Form.Check
                            inline
                            checked
                            type='checkbox'
                            name="cashonDelivery"
                            label={" Cash on Delivery"}
                        />
                        <Form.Check
                            inline
                            disabled
                            type='checkbox'
                            name="cashonDelivery"
                            label={" UPI Payment"}
                        />
                    </Form.Group> */}

                    <Button type='submit' variant='primary'>
                        Check Out
                    </Button>
                </Form>
            </FormContainer>
        ) : (<Form >
            <h1>Your Order has been Confirmed</h1>
            <Row>
                <Col md={7}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h3>Shipping</h3>
                            <p>
                                <strong>Address: </strong>
                                <span>{values.address}, {values.city}, {values.pincode}</span>
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h3>Payment Method</h3>
                            <strong>Method: </strong>
                            <span>Cash on Delivery</span>

                        </ListGroup.Item>

                        {/* <ListGroup.Item>
                                <h2>Order Items</h2>
                                {cart.cartItems.length === 0 ? (
                                    <Message>Your cart is empty</Message>
                                ) : (
                                    <ListGroup variant='flush'>
                                        {cart.cartItems.map((item, index) => (
                                            <ListGroup.Item key={index}>
                                                <Row>
                                                    <Col md={1}>
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            fluid
                                                            rounded
                                                        />
                                                    </Col>
                                                    <Col>
                                                        <Link to={`/product/${item.product}`}>
                                                            {item.name}
                                                        </Link>
                                                    </Col>
                                                    <Col md={4}>
                                                        {item.qty} x ${item.price} = ${item.qty * item.price}
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )}
                            </ListGroup.Item> */}
                    </ListGroup>
                </Col>
                <Col md={5}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>TAX</Col>
                                    <Col>10%</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping Charges</Col>
                                    <Col>Rs.50</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col><strong>Final Total</strong></Col>
                                    <Col><strong>Rs. {(total + (total / 10))}</strong></Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>

                            </ListGroup.Item>

                        </ListGroup>
                    </Card>
                </Col>
            </Row>

            <Button variant='primary'  >
                <Link to='/'>Continue Shopping</Link>
            </Button>

        </Form>)

    )
}

export default ShippingScreen
