const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // ใช้ท่าสั้นๆ แบบที่สอนในห้อง

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '.jpg'); // ใช้แบบง่ายๆ แค่ต่อท้าย .jpg
    }
});
const upload = multer({ storage: storage });

// เชื่อม DB แบบตรงไปตรงมา
let db;
async function connectDB() {
    db = await mysql.createConnection({
        host: 'db',
        user: 'root',
        password: 'ROOT',
        database: 'Webdb',
        port: 3306
    });
    console.log("DB Connected!");
}
connectDB();

app.post('/complaints', upload.single('image'), async (req, res) => {
    try {
        const name = req.body.name;
        const type = req.body.type;
        const detail = req.body.detail;
        const image = req.file ? req.file.filename : null;

        const sql = "INSERT INTO complaints (name, type, detail, image) VALUES (?, ?, ?, ?)";
        const [result] = await db.execute(sql, [name, type, detail, image]);

        res.json({
            complaintId: result.insertId // ส่งแค่ ID กลับไปสั้นๆ
        });
    } catch (err) {
        res.status(500).send("Error!");
    }
});

app.get('/complaints/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute("SELECT * FROM complaints WHERE id = ?", [id]);

        if (rows.length > 0) {
            res.json(rows[0]); // ส่งข้อมูลแถวแรกที่เจอไปให้ Frontend
        } else {
            res.status(404).json({ message: "ไม่พบข้อมูล" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error!");
    }
});

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});