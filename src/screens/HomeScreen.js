import React, { useState, useEffect } from 'react'
import Product from '../components/Product'
import Loader from '../components/Loader'
import TopCarousel from '../components/TopCarousel'
import axios from 'axios'
import { Form, Button, Row, Col, Breadcrumb } from 'react-bootstrap'
import SubmitForm from '../components/SubmitForm'
import Message from '../components/Message'
import { Link } from 'react-router-dom'

const HomeScreen = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState([])
  const [title, setTitle] = useState("All Products")
  const [isAllActive, setAllActive] = useState(true)
  const [isMenActive, setMenActive] = useState(false)
  const [isWomenActive, setWomenActive] = useState(false)
  const [isKidsActive, setKidsActive] = useState(false)
  const userId = parseInt(localStorage.getItem("userId"))
  //token and authorization in header
  const token = localStorage.getItem("token")
  const config = {
    headers: {
      'Authorization': token
    }
  };
  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get('/products')
      setProducts(data)
      setLoading(false)

      axios.get(`users/cart/${userId}`, config)
        .then((posRes) => {
          console.log("cart value", posRes.data.length)
          localStorage.setItem("cart_value", posRes.data.length)
        })
    }
    fetchProducts()
  }, [])
  // useEffect(() =>{
  //   axios.get('/api/products')
  //     .then((posRes) => {
  //         console.log(posRes.products);
  //         setProducts(posRes)
  //   }, (errRes) =>{
  //     console.log("Error",  errRes);
  //   })
  // },[])
  console.log("Products array", products);

  const handleSearch = (e) => {
    const obj = { name: document.getElementById("search").value }
    axios.post(`/products/search`, obj)
      .then((posRes) => {
        console.log("Data from backend", posRes.data);
        setProducts(posRes.data)
        setSearch(obj)
      }, (errRes) => {
        console.log("Error", errRes);
      });
    console.log("Search", obj);
  }
  const fetchHandler = (category) => {

    if (category == 0) {
      setTitle("All Products")
      setAllActive(true)
      setMenActive(false)
      setWomenActive(false)
      setKidsActive(false)
    }
    else if (category == 1) {
      setTitle("Men's Products")
      setAllActive(false)
      setMenActive(true)
      setWomenActive(false)
      setKidsActive(false)
    }
    else if (category == 2) {
      setTitle("Women's Products")
      setAllActive(false)
      setMenActive(false)
      setWomenActive(true)
      setKidsActive(false)
    }
    else {
      setTitle("Kid's Products")
      setAllActive(false)
      setMenActive(false)
      setWomenActive(false)
      setKidsActive(true)
    }
    console.log(category, "category");
    axios.get(`/products/category/${category}`)
      .then((posRes) => {
        console.log("Sucess Category Data", category, posRes.data);
        setProducts(posRes.data)
      })
  }

  return (
    <>
      {/* <TopCarousel /> */}
      <Row>
        <Col>
          <Breadcrumb className=''>
            <Link className={isAllActive ? 'active pr-2 pl-2' : 'cont2'} onClick={() => { fetchHandler(0) }}>Home </Link><span className='pr-2 pl-2'> / </span>
            <Link className={isMenActive ? 'active pr-2 pl-2' : 'cont2'} onClick={() => { fetchHandler(1) }}>Men </Link><span className='pr-2 pl-2'> / </span>
            <Link className={isWomenActive ? 'active pr-2 pl-2' : 'cont2'} onClick={() => { fetchHandler(2) }}>Women </Link><span className='pr-2 pl-2'> / </span>
            <Link className={isKidsActive ? 'active pr-2 pl-2' : 'cont2'} onClick={() => { fetchHandler(3) }}>Kids</Link>
          </Breadcrumb>
        </Col>
        <Col sm={12} md={8} lg={6} xl={6}>
          <Form>
            <Row>
              <Col>
                <Form.Control
                  type='text'
                  id='search'
                  autoComplete='off'
                  name='search'
                  placeholder='Search Products...'
                  className='mr-sm-2 ml-sm-5'
                  onChange={handleSearch}
                ></Form.Control>
              </Col>
              {/* <Col xs="auto">
            <Button className="mb-2" onClick={handleSearch}>
              Submit
            </Button>
          </Col> */}
            </Row>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col>
          <h1>{title}</h1>
        </Col>

      </Row>

      {/* <Form>
        <Form.Control
          type='text'
          autoComplete='off'
          name='search'
          placeholder='Search Products...'
          className='mr-sm-2 ml-sm-5'
        ></Form.Control>
      </Form> */}
      {loading ? <Loader /> : (
        <Row>
          {!products.length ? <Col>
            <Message>
              Product not found
            </Message>
          </Col> : (products.map((product, i) => (
            <Col key={i} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          )))}
        </Row>
      )}

    </>
  )
}

export default HomeScreen
