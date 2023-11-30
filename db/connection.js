// import the mysql2 package
const mysql = require('mysql2');

//connect application to the MYSQL database
const db = mysql.createConnection({
    host: 'localhost',
 
    //SQL Username
    user: 'root',

    //MYSQL password
    password: 'Jay1194!@',
    database: 'company'
});

//Test that the database is working
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
});

module.exports = db