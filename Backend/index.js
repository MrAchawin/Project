const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')
const app = express()
const port = 8000

app.use(cors())
app.use(express.json())

let conn = null
const initDB = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'ROOT',
        database: 'Webdb',
        port: 8821
    })
}

//เพิ่มข้อมูลร้องเรียน
app.post('/complaints', async (req, res) => {
    try {
        const data = req.body
        const sql = `INSERT INTO complaints (name, phone, type, detail, image) VALUES (?, ?, ?, ?, ?)`
        const values = [
            data.name,
            data.phone,
            data.type,
            data.detail,
            data.image
        ]
        const result = await conn.execute(sql, values)
        res.json({
            message: 'เพิ่มข้อมูลสำเร็จ',
            data: result
        })
    } catch (error) {
        res.status(500).json({
            message: 'เกิดข้อผิดพลาด',
            error: error.message
        })
    }
})

//ดูรายการร้องเรียน
app.get('/complaints', async (req, res) => {
    const [rows] = await conn.query('SELECT * FROM complaints')
    res.json(rows)
})

app.listen(port, async () => {
    await initDB()
    console.log('Server running on port ' + port)

})