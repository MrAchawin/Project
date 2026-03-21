document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    try {
        const response = await axios.post('http://localhost:8000/login', { 
        username, 
        password 
    });
        const data = response.data;
        if (response.status !== 200) { 
        return Swal.fire({
            title: 'เข้าสู่ระบบไม่สำเร็จ',
            text: data.message || 'ใส่ชื่อผู้ใช้หรือรหัสผ่านไม่ครบถ้วน',
            icon: 'error'
            });
        }
        Swal.fire({
            title: 'เข้าสู่ระบบสำเร็จ!',
            text: `ยินดีต้อนรับคุณ ${username}`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            location.href = data.role === 'admin' ? 'admin.html' : 'complaint.html';
        });
    } catch (err) {
        Swal.fire({
            title: 'รหัสผ่านไม่ถุกต้อง',
            text: 'ไม่โปรดกรอกใหม่นะครับ',
            icon: 'warning'
        });
        console.error("Login Error:", err);
    }
});