import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Message from '../components/Message'
import axios from 'axios'
import Loader from '../components/Loader'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import 'antd/dist/antd.css';
import { message, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';

const Cartscreen = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState()
  const [total, setTotal] = useState()
  const [cartItems, setCartItem] = useState([])
  const [loading, setLoading] = useState(true)
  const { confirm } = Modal;
  const userId = parseInt(localStorage.getItem("userId"))
  const token = localStorage.getItem("token")
  const config = {
    headers: {
      'Authorization': token
    }
  };
  const data = {

  }
  useEffect(() => {
    fetchProduct()
    // setItems(cartItems.length)
  }, [])
  // const fetchProduct = async () => {
  //   const { data } = await axios.get(`users/cart/${userId}`)
  //   console.log(data);
  //   setItems(data.length)
  //   if (data != "")
  //     setCartItem(data)
  //   let total = 0;
  //   for (let i = 0; i < data.length; i++) {
  //     total = total + data[i].price
  //   }
  //   console.log(total);
  //   setTotal(total);
  // }
  const fetchProduct = async () => {
    const { data } = await axios.get(`users/cart/${userId}`,config)
    setLoading(false)
    console.log(data);
    setItems(data.length)
    if (data != "") {
      setCartItem(data)
    }
    else {
      console.log("Cart got empty");
      setCartItem(0)
    }
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      total = total + (data[i].price * data[i].qty)
      if (data[i].qty <= 0) {
        console.log("Value got Zero of", data[i]);
        deleteFromCart(data[i].id)
      }
    }
    console.log(total);
    setTotal(total);
  }

  const deleteFromCart = (id) => {
    setLoading(true)
    axios.delete(`users/cart/${id}`, { data: {}, headers: { "Authorization": token } }) 
      .then(() => {
        console.log("Delete succesfull");
        message.error('Deleted product from cart')
        fetchProduct()
      }, (errRes) => {
        console.log("Error", errRes);
      });
    //fetchProduct()
    //window.location.reload(false)
  }

  const updateQuantity = (cartid, type,qty,name, description) => {
    //console.log(token);
    if(qty == 1 && type==1){
      showPromiseConfirm1(cartid,name,description)
    }
    else{
      axios.put(`/users/cart/${type}/${cartid}`, {},{ headers: {'Authorization' : token} } )
        .then((posRes) => {
          console.log("Quantity updated", posRes.data);
        })
    }
    
    fetchProduct()
  }

  const checkoutHandler = () => {
    console.log("Proceeded");
    navigate('/shipping', { state: { total: total, cartItems: cartItems } })
  }
  const showPromiseConfirm1 = (id,name, description) => {
    confirm({
      title: 'Do you want to delete this product?',
      icon: <ExclamationCircleOutlined />,
      content: name + "-" + description,
      onOk() {
        return new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          deleteFromCart(id)
        }).catch(() => console.log('Done'));
      },
      onCancel() { },
    });
  };
  const showPromiseConfirm = (id,name,description) => {
    confirm({
      title: 'Do you want to delete this product?',
      icon: <ExclamationCircleOutlined />,
      content: name+"-"+description,
      onOk() {
        return new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          deleteFromCart(id)
        }).catch(() => console.log(''));
      },
      onCancel() { },
    });
  };
  return (
    <>
      
      <Row>
        {/* {!cartdata ? <Message>
        Your Cart is Empty <Link to='/'>Go Back</Link>
      </Message> : <Message>
        Populate all the data <Link to='/'>Go Back</Link>
      </Message>} */}
        <Col md={8}>
          <h1>Shopping Cart</h1>
          {/* {console.log("cartItems.lenght",cartItems.length)} */}
          {!cartItems.length ? <Message>
            Your Cart is Empty <Link to='/'>Go Back</Link>
          </Message> : (
            <ListGroup variant='flush'>
              {/* {console.log(cartItems)} */}
              {cartItems.map((item) => (
                <ListGroup.Item key={item.product_id} >
                  <Row className="d-flex align-items-center">
                    <Col md={2}>
                      <Image src={item.thumbnail} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={3}>
                      <Link to={`/product/${item.product_id}`}>{item.title}-{item.discription}</Link>
                    </Col>
                    <Col md={2}>Rs.{item.price}</Col>
                    <Col md={2}>
                      <Button
                        type='button'
                        variant='light'
                        onClick={(id) => { showPromiseConfirm(item.id,item.title,item.discription) }}
                      >
                        <i className='fas fa-trash'></i>
                      </Button>
                    </Col>
                    <Col md={3}>
                      <Row>
                        <Button
                          type='button'
                          variant='light'
                          onClick={(id) => { updateQuantity(item.id, 0,item.qty,item.title, item.discription) }}
                        >
                          <i className='fas fa-plus'></i>
                        </Button>
                        <span className="d-flex align-items-center">{item.qty}</span>
                        <Button
                          type='button'
                          variant='light'
                          onClick={(id) => { updateQuantity(item.id, 1, item.qty, item.title, item.discription) }}
                        >
                          <i className='fas fa-minus'></i>
                        </Button>
                      </Row>

                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>
                  Subtotal of ( {items} ) items
                </h2>
                <h5>Price-Rs.
                  {total}</h5>
    
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block'
                  disabled={!cartItems.length}
                  onClick={checkoutHandler}
                >
                  Proceed To Checkout
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
    
  )
}

export default Cartscreen
