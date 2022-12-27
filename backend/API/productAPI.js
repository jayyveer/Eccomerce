const { json } = require('body-parser')
let express = require('express')
let router = express.Router()
let conn = require("../config/db_connection")
let connection = conn.getConnection()
connection.connect()
//API to get all products
router.get("/", (req, res) => {
    connection.query("select * from products", (err, recordsArray) => {
        if (err)
            res.json({ 'message': 'error' + err })
        else {
            // console.log('Data sent')
            // console.log(recordsArray);
            res.json(recordsArray)
        }
    })
})
//API to add products by admin
router.post("/admin/:id", (req, res) => {
    console.log(req.params.id);
    const id = req.body.id
    const p_id = req.body.p_id
    const thumbnail =  req.body.thumbnail
    const title = req.body.title
    const category = req.body.category
    const price = req.body.price
    const discountedprice = req.body.discountedprice
    const discription = req.body.discription
    const stock =req.body.stock
    if (req.params.id == 1) {
        connection.query(`INSERT INTO products(p_id,thumbnail,title,category,price,discountedprice,discription,stock) VALUES 
(${p_id},'${thumbnail}','${title}','${category}',${price},${discountedprice},'${discription}',${stock})`, (err, recordsArray) => {
            if (err) {
                res.json({ 'message': 'error' + err })
            }
            else {
                res / json(recordsArray)
            }
        })
        console.log("Inside Admin API");
        res.json({ 'message': 'Admin Access allowed' })
    }
    else {
        res.json({ 'message': 'Admin Access not allowed' })
    }
})
//API to get specific products}
router.get('/:id', (req, res) => {

    // const product = products.find((p) => p.id == req.params.id)
    // res.json(product)
    console.log(req.params.id);
    connection.query(`select * from products where id = ${req.params.id}`, (err, recordsArray) => {
        if (err)
            res.json({ 'message': 'error' + err })
        else {
            // console.log('Data sent')
            // console.log(recordsArray);
            res.json(recordsArray[0])
        }
    })
})
//API for search
router.post('/search', (req, res) => {
    const name = req.body
    connection.query(`select * from products where title like '%${name.name}%' or discription like '%${name.name}%'`,
        (err, recordsArray) => {
            if (err)
                err.json({ 'message': 'error' + err })
            else {
                res.json(recordsArray)
            }
        }
    )
})
//API for category wise sorting
router.get("/category/:category", (req, res) => {
    const category = req.params.category
    console.log(category, "category");
    if (category == 0) {
        connection.query("select * from products", (err, recordsArray) => {
            if (err)
                res.json({ 'message': 'error' + err })
            else {
                // console.log('Data sent')
                // console.log(recordsArray);
                res.json(recordsArray)
            }
        })
    }
    else if (category == 1) {
        connection.query(`select * from products where category="Male"`, (err, recordsArray) => {
            if (err)
                res.json({ 'message': 'error' + err })
            else {
                // console.log('Data sent')
                // console.log(recordsArray);
                res.json(recordsArray)
            }
        })
    }
    else if (category == 2) {
        connection.query(`select * from products where category="Female"`, (err, recordsArray) => {
            if (err)
                res.json({ 'message': 'error' + err })
            else {
                // console.log('Data sent')
                // console.log(recordsArray);
                res.json(recordsArray)
            }
        })
    }
    else if (category == 3) {
        connection.query(`select * from products where category="Kids"`, (err, recordsArray) => {
            if (err)
                res.json({ 'message': 'error' + err })
            else {
                // console.log('Data sent')
                // console.log(recordsArray);
                res.json(recordsArray)
            }
        })
    }
})

module.exports = router