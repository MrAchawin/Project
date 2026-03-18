const express = require('express');
const cors = require('cors');
const multer = require('multer');
const adminRoutes = require('./admin');
const path = require('path');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/admin-api', adminRoutes);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '.jpg');
    }
});
const upload = multer({ storage: storage });

app.post('/complaints', upload.single('image'), async (req, res) => {
    try {
        const { name, type, detail } = req.body;
        const image = req.file ? req.file.filename : null;

        const sql = "INSERT INTO complaints (name, type, detail, image) VALUES (?, ?, ?, ?)";
        const [result] = await db.execute(sql, [name, type, detail, image]);

        res.json({ complaintId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error!");
    }
});

app.get('/complaints/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute("SELECT * FROM complaints WHERE id = ?", [id]);

        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: "ไม่พบข้อมูล" });
        }
    } catch (err) {
        res.status(500).send("Error!");
    }
});

app.listen(8000, '0.0.0.0', () => {
    console.log("✅ Server is running on port 8000");
});