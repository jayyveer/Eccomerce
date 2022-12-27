let mysql = require('mysql')
let dbproperties = require('./db_properties')
module.exports = {
    getConnection: () => {
        return mysql.createConnection(dbproperties)
    }
}