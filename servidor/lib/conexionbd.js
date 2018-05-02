require('dotenv').config();
var mysql = require('mysql');

console.log("Host: "+ process.env.DB_HOST+
          "; Port: "+ process.env.DB_PORT+
          "; User: "+ process.env.DB_USER+
          "; Pass: "+ process.env.DB_PASS+
          "; Database: "+ process.env.DB_DATABASE);
var connection = mysql.createConnection({
  host    : process.env.DB_HOST,
  port    : process.env.DB_PORT,
  user    : process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE
});

module.exports = connection;
