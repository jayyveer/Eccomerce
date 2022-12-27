let express = require('express')
let router = express.Router()
let conn = require("../config/db_connection")
let connection = conn.getConnection()
const jwt = require('jsonwebtoken')
const token = require('../auth/token')
const { message } = require('antd')
const nodemailer = require('nodemailer')
const verify = require('jsonwebtoken/verify')
const JWT_SECRET = "secret"
connection.connect()
//API to fetch all users
router.get("/", (req, res) => {
    connection.query("select * from users", (err, recordsArray) => {
        if (err)
            res.json({ 'message': 'error' + err })
        else {
            // console.log('Data sent')
            // console.log(recordsArray);
            res.json(recordsArray)
        }
    })
})
//API for Login 
router.post("/login", (req, res) => {
    connection.query(`select * from users where email = "${req.body.email}" and password = "${req.body.password}"`, (err, userDetails) => {
        console.log("user details", userDetails, req.body.email, req.body.password);

        if (err) {
            res.json({ error: "Error in fetching details" })
        }
        else if (userDetails.length) {
            let user_token = token.generateToken(userDetails[0].id)
            res.json({ user_id: userDetails[0].id, token: user_token, message: "success", name: userDetails[0].name })
        }
        else {
            res.status(404).json({ message: "User does not exist! Create new account" })
        }
    })
})

router.get('/:id', (req, res) => {
    connection.query(`select * from users where id=${req.params.id}`, (err, recordsArray) => {
        if (err)
            res.json({ 'message': 'error' + err })
        else {
            console.log(recordsArray);
            res.json(recordsArray)
        }
    })
})
//API for signup
router.post("/signup", (req, res) => {
    let user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    }
    //console.log(user.name,"User data from object");
    connection.query(`insert into users(name, email, password) values("${user.name}","${user.email}","${user.password}")`, (err, recordsArray) => {
        if (err)
            res.json({ 'message': 'Error in Creating Account' + err })
        else {
            // console.log('Data sent')
            // console.log(recordsArray);
            // res.json(recordsArray)
            res.send("Account Created")
            //console.log("Created Account");
        }
    })
})
//API for forgot password
router.post("/forgot-password", (req, res) => {
    const { email } = req.body
    console.log(email,);
    //Create login link
    const secret = JWT_SECRET + email
    const payload = {
        email: email
    }
    const token = jwt.sign(payload, secret, { expiresIn: '15m' })
    const link = `http://localhost:3000/reset-password/${email}/${token}`

    //mail functionality
    var transporter = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        auth: {
            user: '246e0de081813c',
            pass: '507f3b73bf0ac4'
        }
    });

    var mailOptions = {
        from: 'info@cosmoshop.com',
        to: email,
        subject: 'Password Rest link',
        text: "Here is your login link.  " + link
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    console.log("Forgot Paasword link", link);
})

// router.get('/reset-password/:email/:token', (req, res) => {
//     const email = req.params.email
//     const token = req.params.token
//     console.log("Params Value", email, token);
//     res.send(req.params)
// })

//API for reset password
router.post("/reset-password/:email", (req, res) => {
    connection.query(`UPDATE users set password="${req.body.password}" WHERE email = "${req.params.email}"`, (err, recordsArray) => {
        if (err)
            res.json({ 'message': 'Cannot change password' + err })
        else {
            console.log('Password Changed')
            // console.log(recordsArray);
            res.json(recordsArray)
        }
    })
})

//API to add products into the cart by the logged in user
router.post("/cart",verifyToken ,(req, res) => {
    jwt.verify(req.token, "secureKey", (err, authData) => {
        // console.log(req);
        if (err) {
            console.log("error section of API", err);
            res.sendStatus(403)
        }
        else {
            let data = {
                userId: req.body.userId,
                productId: req.body.productId,
                productPrice: req.body.productPrice
            }
            connection.query(`insert into cart(user_id, product_id, product_price) values("${data.userId}","${data.productId}","${data.productPrice}")`, (err, recordsArray) => {
                if (err) {
                    res.json({ 'message': 'Error in Adding Account' + err })
                    message.error("Cannot be Added !")
                }
                else {
                    res.json(recordsArray)
                    console.log("Product Inserted into cart");
                }
        
            })
        }
    });

})

//API to post data to orderhistory table
router.post("/order", verifyToken,(req, res) => {
    jwt.verify(req.token, "secureKey", (err, authData) => {
        // console.log(req);
        if (err) {
            console.log("error section of API", err);
            res.sendStatus(403)
        }
        else {
            const data = {
                user_id: req.body.user_id,
                product_id: req.body.product_id,
                thumbnail: req.body.thumbnail,
                title: req.body.title,
                discription: req.body.discription,
                price: req.body.price,
                qty: req.body.qty
            }
            console.log(data);
            connection.query(`INSERT  INTO orderhistory(user_id, product_id, thumbnail, title, discription, price, qty) VALUES (${data.user_id}, ${data.product_id},'${data.thumbnail}','${data.title}','${data.discription}',${data.price},${data.qty});`, (err, recordsArray) => {
                if (err) {
                    res.json({ 'message': 'Error in Adding Account' + err })
                    message.error("Cannot be Added !")
                }
                else {
                    res.json(recordsArray)
                }
        
            })
        }
    });

})
//API to fetch data from orderHistory table
router.get('/order/:id', (req, res) => {
    connection.query(`select * from orderhistory where user_id=${req.params.id}`, (err, recordsArray) => {
        if (err)
            res.json({ 'message': 'error' + err })
        else {
            console.log(recordsArray);
            res.json(recordsArray)
        }
    })
})

//API to fethc cart details 
router.get("/cart/:id",verifyToken, (req, res) => {
    // userId = parseInt(localStorage.getItem("userId")),
    jwt.verify(req.token, "secureKey", (err, authData) => {
        // console.log(req);
        if (err) {
            console.log("error section of API", err);
            res.sendStatus(403)
        }
        else {
            connection.query(`select c.id, c.user_id,p.id as product_id,c.qty, p.thumbnail, p.title, p.category, p.price, p.discountedprice, p.discription, p.stock  from cart c inner join products p on c.product_id=p.id where user_id="${req.params.id}"`, (err, recordsArray) => {
                if (err) {
                    res.json({ 'message': 'Error in fetching data' + err })
                }
                else {
                    res.json(recordsArray)
                }
            })            
        }
    });
})
//API to delete from cart
router.delete("/cart/:id", verifyToken, (req, res) => {
    
    jwt.verify(req.token, "secureKey", (err, authData) => {
        // console.log(req);
        if (err) {
            console.log("error section of API", err);
            res.sendStatus(403)
        }
        else {
            connection.query(`delete from cart where id = ${req.params.id}`, (err, recordsArray) => {
                if (err)
                    res.json({ 'message': 'error' + err })
                else
                    res.json(recordsArray[0])
                
            })
        }
    });
})
//API to delete all products after checkout
router.delete("/cart/delete/:userId", verifyToken, (req, res) => {
    jwt.verify(req.token, "secureKey", (err, authData) => {
        // console.log(req);
        if (err) {
            console.log("error section of API", err);
            res.sendStatus(403)
        }
        else {
            connection.query(`delete from cart where user_id = ${req.params.userId}`, (err, recordsArray) => {
                if (err)
                    res.json({ 'message': 'error' + err })
                else
                    res.json(recordsArray[0])
            })
        }
    });
})

//format of token
//Authorization: Bearer <acess_token>
function verifyToken(req, res, next) {
    //get auth header value send token in header
    const bearerHeader = req.headers['authorization'];
    // console.log();
    //check if bearer is undefined not undefined
    if (typeof bearerHeader !== 'undefined') {
        //split at the space
        const bearer = bearerHeader;
        //getr token from array
        const bearerToken = bearer;
        //set the token
        //console.log("bearer",bearer,"bearerheader",bearerHeader,"bearertoken",bearerToken);
        req.token = bearerToken;
        //next middleware
        next();
    }
    else {
        //Forbidden
        res.sendStatus(403);
    }
}

//API for plus minus quantity buttons
router.put("/cart/:type/:id", verifyToken, (req, res) => {
    jwt.verify(req.token, "secureKey", (err, authData) => {
        // console.log(req);
        if (err) {
            console.log("error section of API", err);
            res.sendStatus(403)
        }
        else {
            const type = req.params.type
            if (type == 1) {
                connection.query(`update cart set qty = qty-1 where id = ${req.params.id}`, (err, recordsArray) => {
                    if (err)
                        res.json({ 'message': 'error' + err })
                    else
                        res.json(recordsArray[0])
                })
                console.log("Update Quantity");
                res.sendStatus(200)
            }
            else {
                connection.query(`update cart set qty = qty+1 where id = ${req.params.id}`, (err, recordsArray) => {
                    if (err)
                        res.json({ 'message': 'error' + err })
                    else
                        res.json(recordsArray[0])
                })
                console.log("Update Quantity");
                res.sendStatus(200)
            }
        }
    });
})
module.exports = router