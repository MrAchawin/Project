const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/complaints', async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM complaints WHERE status = 'รอดำเนินการ'");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching data" });
    }
});

router.patch('/complaints/:id/complete', async (req, res) => {
    const { id } = req.params;
    try {
        const query = "UPDATE complaints SET status = 'เสร็จสิ้นการดำเนินการ' WHERE id = ?";
        await db.execute(query, [id]);
        res.json({ message: "Update success" });
    } catch (err) {
        res.status(500).json({ message: "Update failed" });
    }
});

module.exports = router;
