CREATE DATABASE IF NOT EXISTS Webdb; -- สร้างถ้ายังไม่มี
USE Webdb; -- ตารางถูกสร้างใน Webdb

-- 1. สร้างตารางสำหรับเก็บข้อมูลผู้ใช้งาน (Login)
CREATE TABLE Login (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user'
);

-- 2. สร้างตารางสำหรับเก็บเรื่องร้องเรียน (complaints)
CREATE TABLE complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(255),
    type VARCHAR(100),
    detail TEXT,
    image VARCHAR(255),
    status VARCHAR(50) DEFAULT 'รอดำเนินการ',
    CONSTRAINT fk_user_complaint 
    FOREIGN KEY (user_id) REFERENCES Login(id) 
    ON DELETE CASCADE
);