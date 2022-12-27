import { Container } from "react-bootstrap";
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Footer from "./components/Footer";
import Header from "./components/Header";
import HomeScreen from "./screens/HomeScreen";
import ProductsScreen from "./screens/ProductsScreen";
import Loginscreen from "./screens/Loginscreen";
import Registerscreen from "./screens/Registerscreen";
import Cartscreen from "./screens/Cartscreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import LinkConfirmation from "./screens/LinkConfirmation";
import ProfileScreen from "./screens/ProfileScreen";
import ShippingScreen from "./screens/ShippingScreen";
import { useEffect, useState } from "react";
import axios from "axios";
function App() {
  const userId = parseInt(localStorage.getItem("userId"))
  const [cart, setCart] = useState(0)

  //token and authorization in header
  const token = localStorage.getItem("token")
  const config = {
    headers: {
      'Authorization': token
    }
  };
  useEffect(() => {
    const fetchProducts = async () => {
      // const { data } = await axios.get('/products')
      // setProducts(data)
      // setLoading(false)

      axios.get(`users/cart/${userId}`, config)
        .then((posRes) => {
          console.log("cart value", posRes.data.length)
          localStorage.setItem("cart_value", posRes.data.length)
          setCart(posRes.data.length)
        })
    }
    fetchProducts()
  }, [])
  return (
    <Router>
      <Header cart = {cart}/>
      <main className="py-3 ">
        <Container>
        <Routes>
            <Route exact path='/' element={<HomeScreen />}/>
            <Route path='profile/' element={<ProfileScreen />}/>
            <Route path='product/:id' element={<ProductsScreen cart={cart} setCart={setCart} />}/>
            <Route path='cart/' element={<Cartscreen cart={cart} setCart={setCart} />}/>
            <Route path='login/' element={<Loginscreen />} />
            <Route path='register/' element={<Registerscreen/>}/>
            <Route path='forgot-password/' element={<ForgotPasswordScreen/>}/>
            <Route path='reset-password/:email/:token' element={<ResetPasswordScreen/>}/>
            <Route path='link-confirmation/' element={<LinkConfirmation/>}/>
            <Route path='shipping' element={<ShippingScreen/>}/>
        </Routes>
          
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
// import React, { useState } from 'react';
// import ReactQuill, { Quill } from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import { Modal } from 'antd';
// import 'antd/dist/antd.css';

// function App() {
//   const [value, setValue] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const showModal = () => {
//     setIsModalOpen(true);
//   };

//   const handleOk = () => {
//     setIsModalOpen(false);
//   };

//   const handleCancel = () => {
//     setIsModalOpen(false);
//   };
//   const mYtoolbar = [
//     [{ header: [1, 2, false] }],
//     ["bold", "italic", "underline", "strike", "blockquote"],
//     [{ list: "ordered" }, { list: "bullet" }],
//     ["link", "image", "video"]
//   ]

  
//   const modules= {
//     toolbar: {
//       container: mYtoolbar,
//       handlers: {
//         image: imageHandler
//       }
//     }
//   }

//   function imageHandler() {
//     showModal()
//     // var range = this.quill.getSelection();
//     // var value = prompt('Please copy paste the image url here.');
//     // if (value) {
//     //   this.quill.insertEmbed(range.index, 'image', value, Quill.sources.USER);
//     // }
//   }

//   const formats = [
//     "header",
//     "bold",
//     "italic",
//     "underline",
//     "strike",
//     "blockquote",
//     "list",
//     "bullet",
//     "indent",
//     "link",
//     "image",
//     "video"
//   ];
//   return (

//     <div>
//       <ReactQuill theme="snow" modules={modules} value={value} formats={formats} onChange={setValue} />;
//       <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        
//       </Modal>
//     </div>
//   );
// }

// export default App;