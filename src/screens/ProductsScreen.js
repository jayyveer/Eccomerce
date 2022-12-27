import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'
import Loader from '../components/Loader'
import axios from 'axios'
import 'antd/dist/antd.css';
import { message, notification } from 'antd'

const ProductsScreen = ({ cart, setCart }) => {

  const openNotificationWithIcon = (info) => {
    notification[info]({
      message: 'Login to continue',
      description:
        'You need to login first before you can add products to cart.',
    });
  };

  const id = (window.location.pathname.split("/")[2]) 
  // console.log(id);
  // const product = products[id]
  const navigate = useNavigate();
  const [product, setProduct] = useState({})
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const token = localStorage.getItem("token")
  const config = {
    headers: {
      'Authorization': token
    }
  };
  
  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`/products/${id}`)
      console.log("use effect",data);
      setProduct(data)
      // console.log(product.title);
      setLoading(false)
    }
    fetchProduct()
  }, [])
  
  // const addToCart = () => { 
  //   const cartData = {
  //     userId: parseInt(localStorage.getItem("userId")),
  //     productId: product.id,
  //     productPrice: product.price
  //   }
  //   console.log(cartData);
  //   if(!cartData.userId){
  //     console.log("User not found");
  //     //message.info("Please login to acess cart!")
  //     openNotificationWithIcon('info')
  //   }
  //   else{
  //     console.log("User found");
  //     axios.post('/users/cart', cartData)
  //     .then((posRes) => {
  //       message.success("Product Added Succesfully")
  //       console.log("Product Added to Cart", posRes);
  //     }, (errRes) => {
  //       console.log("Error", errRes);
  //       message.error("Please try again!!")
  //     })
  //   }
  
  // }
  const addToCart = (productId) => {  
    const cartData = {
      userId: parseInt(localStorage.getItem("userId")),
      productId: product.id,
      productPrice: product.price
    }
    console.log(cartData);

    if (!cartData.userId) {
      //if user not logged in
      console.log("User not found",productId);
      //message.info("Please login to acess cart!")
      openNotificationWithIcon('info')
      navigate('/login', { state: { productId : productId } })
      
    }
    else {
      //when user logged in so fetch all cart details
      axios.get(`/users/cart/${cartData.userId}`,config)
        .then((posRes) => {
          console.log(posRes.data, "Table data cart");
          let flag = 0;
          //if cart is empty then add product
          if (posRes.data.length == 0) {
            axios.post('/users/cart', cartData, config)
              .then((posRes) => {
                setCart(posRes.data.length)
                message.success("Product Added Succesfully")
                console.log("Product Added to Cart", posRes);
                localStorage.setItem("cart_value", 1)
              }, (errRes) => {
                console.log("Error", errRes);
                message.error("Please try again!!")
              })
          }
          else {
            //if cart is not empty then check if product is already there or not if there then flag =1
            for (let i = 0; i < posRes.data.length; i++) {
              // console.log(cartData.productId);
              // console.log(posRes.data[i].product_id);
              if (cartData.productId == posRes.data[i].product_id) {
                flag = 1;
                break
              }
            }
            if (flag == 1) {
              console.log("Product Found");
              // axios.put(`/users/cart}`, cartData)
              //   .then((posRes) => {
              //     message.success("Quantity updated")
              //     console.log("Quantity updated", posRes);
              //   })
              // break
              message.info("Product Already in cart!!")

            }
            else {
              //when product is not already in cart then add it to the cart
              console.log("Product not Found");
              axios.post('/users/cart', cartData, config)
                .then((posRes) => {
                  message.success("Product Added Succesfully")
                  console.log("Product Added to Cart", posRes);
                  let cart = parseInt(localStorage.getItem("cart_value"))
                  cart += 1
                  console.log("cart", cart);
                  localStorage.setItem("cart_value", cart)
                }, (errRes) => {
                  console.log("Error", errRes);
                  message.error("Please try again!!")
                })
                
              
            }
            // const userId = parseInt(localStorage.getItem("userId"))
            // axios.get(`users/cart/${userId}`)
            //   .then((posRes) => {
            //     console.log("cart value", posRes.data.length)
            //     localStorage.setItem("cart_value", posRes.data.length)
            //   })

          }

        }, (errRes) => {
          console.log("Error", errRes);
        })
    }
    

  }
  //console.log(product.title);
  return (
    <>
    
      {loading ? <Loader /> : null}
      <Row>
        <Col md={5}>
          <Image src={product.thumbnail} alt={product.name} fluid />
        </Col>
        <Col md={4}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h3>{product.title}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              Price: Rs {product.price}
            </ListGroup.Item>
            <ListGroup.Item>
              Description: {product.discription}
            </ListGroup.Item>
          </ListGroup>
          <Card className='my-5'>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    <strong>Rs.{product.price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    {product.stock > 0 ? 'In Stock' : 'Out Of Stock'}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button className='btn-block' type='button'
                // disabled={product.countInStock === 0}
                  onClick={() => addToCart(product.id)}
                >
                  Add To Cart
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>


      </Row>
      <Link className='btn btn-dark rounded my-3' to='/'>
        Go Back
      </Link>
    </>
  )
}

export default ProductsScreen
