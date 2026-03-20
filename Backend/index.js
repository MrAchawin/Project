const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('./db');
const fs = require('fs');

const app = express();

dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ตั้งค่า Multer สำหรับเก็บรูปภาพ
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/'); },
    filename: (req, file, cb) => { cb(null, Date.now() + '.jpg'); }
});
const upload = multer({ storage: storage });

// --- 1. ระบบสมัครสมาชิก ---
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO Login (username, password, role) VALUES (?, ?, 'user')";
        await db.execute(sql, [username, hashedPassword]);
        res.status(201).json({ message: "สมัครสมาชิกสำเร็จ!" });
    } catch (err) {
        res.status(500).json({ error: "ชื่อผู้ใช้นี้อาจมีคนใช้แล้ว" });
    }
});

// --- 2. ระบบเข้าสู่ระบบ ---
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const [rows] = await db.execute("SELECT * FROM Login WHERE username = ?", [username]);
        if (rows.length === 0) return res.status(401).json({ error: "ไม่พบผู้ใช้งาน" });
        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "รหัสผ่านผิด" });
        res.json({ 
            message: "Login สำเร็จ",
            role: user.role, 
            username: user.username });
    } catch (err) {
        res.status(500).json({ error: "ระบบขัดข้อง" });
    }
});

// --- 3. ระบบส่งเรื่องร้องเรียน ---
app.post('/complaints', upload.single('image'), async (req, res) => {
    try {
        const { name, type, detail} = req.body;
        const image = req.file ? req.file.filename : null;
        const sql = "INSERT INTO complaints (name, type, detail, image, status) VALUES (?, ?, ?, ?, 'รอดำเนินการ')";
        const [result] = await db.execute(sql, [name, type, detail, image]);
        res.json({ complaintId: result.insertId, message: "ส่งเรื่องร้องเรียนสำเร็จ" });
    } catch (err) {
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" });
    }
});

// --- 4. ดึงข้อมูลรายบุคคล (User เช็คสถานะ) ---
app.get('/complaints/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute("SELECT * FROM complaints WHERE id = ?", [id]);
        if (rows.length > 0) res.json(rows[0]);
        else res.status(404).json({ message: "ไม่พบข้อมูล" });
    } catch (err) {
        res.status(500).json({ error: "Error!" });
    }
});

// --- 5. ดึงข้อมูลทั้งหมดสำหรับ Admin ---
app.get('/admin/complaints', async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM complaints ORDER BY id DESC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "ไม่สามารถดึงข้อมูลได้" });
    }
});

// --- 6. อัปเดตสถานะ (รวม Logic ลบรูปภาพเมื่อเสร็จสิ้น) ---
app.put('/admin/complaints/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        if (status === 'เสร็จสิ้น') {
            // ดึงชื่อไฟล์มาลบใน VS Code
            const [rows] = await db.execute("SELECT image FROM complaints WHERE id = ?", [id]);
            if (rows.length > 0 && rows[0].image) {
                const filePath = path.join(__dirname, 'uploads', rows[0].image);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log(`ลบไฟล์ ${rows[0].image} เรียบร้อยแล้ว`);
                }
            }
            // อัปเดต DB: เปลี่ยนสถานะ และล้างชื่อรูปเป็น NULL
            await db.execute("UPDATE complaints SET status = ?, image = NULL WHERE id = ?", [status, id]);
        } else {
            await db.execute("UPDATE complaints SET status = ? WHERE id = ?", [status, id]);
        }
        res.json({ success: true, message: "อัปเดตสำเร็จ" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
});

// --- 7. ลบข้อมูลร้องเรียน (รวม Logic ลบไฟล์ขยะ) ---
app.delete('/admin/complaints/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute("SELECT image FROM complaints WHERE id = ?", [id]);
        if (rows.length > 0 && rows[0].image) {
            const filePath = path.join(__dirname, 'uploads', rows[0].image);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        await db.execute("DELETE FROM complaints WHERE id = ?", [id]);
        res.json({ message: "ลบข้อมูลและไฟล์เรียบร้อย" });
    } catch (err) {
        res.status(500).json({ error: "ไม่สามารถลบข้อมูลได้" });
    }
});

// เริ่มต้น Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});