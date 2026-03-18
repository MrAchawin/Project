const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'db', // ชื่อ Service ใน docker-compose
    user: 'root',
    password: 'ROOT',
    database: 'Webdb',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool;