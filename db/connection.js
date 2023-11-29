// import the mysql2 package
const mysql = require('mysql2');

//connect to application to the MYSQL database
const db = mysql.createConnection({
    host: 'localhost',

    //SQL Username
    user: 'root',

    //MYSQL password
    password: 'Jay1194!@',
    database: 'election'
});

module.exports = db
    