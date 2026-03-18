const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'db',
    user: 'root',
    password: 'ROOT',
    database: 'Webdb'
});

module.exports = db;