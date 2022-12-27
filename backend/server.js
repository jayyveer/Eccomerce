const express = require('express')
const app = express()
let bodyparser = require('body-parser')
let cors = require('cors')
// const products = require('./data/products')

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: false }))
app.use(cors())

//API's fetching data from products.js
// app.get('/', (req, res) => {
//     res.send('API is Running...')
// })

// app.get('/api/products', (req, res) => {
//     res.json(products)
// })

// app.get('/api/products/:id', (req, res) => {
    
//     const product = products.find((p) => p.id == req.params.id)
//     res.json(product)
//     console.log(product);
// })

//API fetching data from mysql database  

let products = require('./API/productAPI')
app.use('/products', products)
// http://localhost:5000/products  (get)
// http://localhost:5000/products/1  (get)

let users = require('./API/userAPI')
app.use('/users', users)


app.listen(5000, console.log('Server is running on port 5000'))