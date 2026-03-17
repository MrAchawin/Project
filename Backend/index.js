const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // เก็บในโฟลเดอร์ uploads
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

let conn = null;
const initDB = async () => {
    conn = await mysql.createConnection({
        host: 'localhost', // ⚠️ ถ้าใช้ Docker เปลี่ยนเป็น 'db'
        user: 'root',
        password: 'ROOT',
        database: 'Webdb',
        port: 8821 // ⚠️ Docker ใช้ 3306
    });
};

app.post('/complaints', upload.single('image'), async (req, res) => {
    try {
        const { name, phone, type, detail } = req.body;
        const image = req.file ? req.file.filename : null;

        const sql = `
            INSERT INTO complaints (name, phone, type, detail, image)
            VALUES (?, ?, ?, ?, ?)
        `;

        await conn.execute(sql, [name, phone, type, detail, image]);

        res.json({
            message: 'เพิ่มข้อมูลสำเร็จ'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'เกิดข้อผิดพลาด',
            error: error.message
        });
    }
});

app.get('/complaints', async (req, res) => {
    try {
        const [rows] = await conn.query('SELECT * FROM complaints');
        res.json(rows);
    } catch (error) {
        res.status(500).json({
            message: 'ดึงข้อมูลไม่สำเร็จ',
            error: error.message
        });
    }
});

app.listen(port, async () => {
    await initDB();
    console.log('Server running on port ' + port);
});