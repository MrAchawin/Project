document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('http://localhost:8000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) {
            return Swal.fire({
                title: 'เข้าสู่ระบบไม่สำเร็จ',
                text: data.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
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
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้',
            icon: 'warning'
        });
        console.error(err);
    }
});