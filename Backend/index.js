const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ตั้งค่า Multer สำหรับเก็บไฟล์ภาพ
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/'); },
    filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage: storage });

// เชื่อมต่อ Database (ตั้งค่าตาม Docker Compose)
let db;
async function connectDB() {
    try {
        db = await mysql.createConnection({
            host: 'db', // ชื่อ Service ใน docker-compose
            user: 'root',
            password: 'ROOT',
            database: 'Webdb',
            port: 3306
        });
        console.log("✅ Database Connected Successfully!");
    } catch (err) {
        console.log("❌ DB Waiting... (Retrying in 5s)", err.message);
        setTimeout(connectDB, 5000);
    }
}
connectDB();

// --- 1. ระบบสมัครสมาชิก (Register) ---
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO Login (username, password, role) VALUES (?, ?, 'user')";
        await db.execute(sql, [username, hashedPassword]);
        res.status(201).json({ message: "Success" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "ชื่อผู้ใช้นี้อาจมีคนใช้แล้ว" });
    }
});

// --- 2. ระบบเข้าสู่ระบบ (Login) ---
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const [users] = await db.execute("SELECT * FROM Login WHERE username = ?", [username]);
        
        if (users.length === 0) return res.status(401).json({ error: "ไม่พบชื่อผู้ใช้นี้" });

        const match = await bcrypt.compare(password, users[0].password);
        if (!match) return res.status(401).json({ error: "รหัสผ่านไม่ถูกต้อง" });

        res.json({ 
            message: "Login Success", 
            user: { username: users[0].username, role: users[0].role } 
        });
    } catch (err) {
        res.status(500).json({ error: "เกิดข้อผิดพลาดที่ระบบ" });
    }
});

// --- 3. ระบบส่งเรื่องร้องเรียน (Complaints) ---
app.post('/complaints', upload.single('image'), async (req, res) => {
    try {
        const { name, type, detail } = req.body;
        const image = req.file ? req.file.filename : null;
        const sql = "INSERT INTO complaints (name, type, detail, image) VALUES (?, ?, ?, ?)";
        const [result] = await db.execute(sql, [name, type, detail, image]);
        res.json({ complaintId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: "ไม่สามารถบันทึกข้อมูลได้" });
    }
});

app.listen(8000, '0.0.0.0', () => {
    console.log("🚀 Server is running on port 8000");
});