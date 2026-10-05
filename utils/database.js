var mysql =require('mysql');
require('dotenv').config({url: __dirname + '/../.env'});
var pool = mysql.createPool({
    connectionLimit:    process.env.DB_CONN_LIMIT,
    multipleStatements: process.env.DB_MULTI,
    host:               process.env.DB_HOST,
    user:               process.env.DB_USER,
    password:           process.env.DB_PASS,
    port:               process.env.DB_PORT,
    database:           process.env.DB_NAME,
    timezone:           process.env.DB_TIMEZONE
});
module.exports = pool;