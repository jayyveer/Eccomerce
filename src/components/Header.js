import React, { useEffect, useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import SubmitForm from './SubmitForm';
import 'antd/dist/antd.css';
import { message } from 'antd'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = ({ cart_value, cart }) => {
  const [loginStatus, setLoginStatus] = useState(false)
  const [userl, setUserl] = useState({})
  const user = JSON.parse(localStorage.getItem('user')) || {}
  const navigate = useNavigate();
  const [items, setItems] = useState(0)
  const [item2, setItems2] = useState(0)
  const userId = parseInt(localStorage.getItem("userId"))
  //const cart = parseInt(localStorage.getItem("cart_value"))
  const token = localStorage.getItem("token")
  const config = {
    headers: {
      'Authorization': token
    }
  };
  const fetchcart = async () => {
    axios.get(`users/cart/${userId}`, config)
      .then((posRes) => {
        setItems2(posRes.data.length)
      }, (errRes) => {
        console.log("Error", errRes);
      })

  }
  useEffect(() => {
    //fetchcart()
    //console.log("Use effect called");
  }, [cart])
  useEffect(() => {

    if (user.user_id) {
      // const { data } = axios.get(`users/cart/${user.user_id}`)
      // setItems(data.length)
      setLoginStatus(true)
      setUserl(user)
      setItems(cart)

    }
    else {
      setLoginStatus(false)
      setUserl({})
    }
    fetchcart()

  }, [cart])
  //console.log("Cartttt", cart)
  const logoutHandler = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('userId')
    localStorage.removeItem('cart_value')
    localStorage.removeItem('token')
    navigate("/");
    window.location.reload(true);
    message.info("Logged out Succesfully")
  }
  const infoMessage = () => {
    message.info("Login to acess Cart!")
  }
  // let cart = parseInt(localStorage.getItem("cart_value"))
  // // const { data } = axios.get(`users/cart/${user.user_id}`)
  // setItems(cart)
  return (
    <header>
      <Navbar bg="dark" variant='dark' expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>Cosmo</Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              {loginStatus ? (
                <LinkContainer to='/cart'>
                  <Nav.Link><i className='fas fa-shopping-cart'></i> Cart {`${cart}`}</Nav.Link>
                </LinkContainer>
              ) :
                <LinkContainer to='/login'>
                  <Nav.Link className='mr-1'> Login</Nav.Link>
                </LinkContainer>
              }

              {/* <LinkContainer to='/register'>
                <Nav.Link href="/register"><i className='fas fa-user'></i> Sign up</Nav.Link>  
              </LinkContainer> */}
              {user.user_id ? (
                <NavDropdown title={user.name} id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (

                <LinkContainer to='/register'>
                  <Nav.Link>
                    <i className='fas fa-user'></i> <span className='ml-3'>
                      Register
                    </span>
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
