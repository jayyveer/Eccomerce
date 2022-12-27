const jwt = require("jsonwebtoken")
generateToken = (obj) => {
    return jwt.sign(obj, "secureKey")
}
//  verifyToken =(token)=>{

//  } 
module.exports = { generateToken }