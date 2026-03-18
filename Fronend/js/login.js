document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault(); 

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('http://localhost:8000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (res.ok) {
            Swal.fire({
                title: 'เข้าสู่ระบบสำเร็จ!',
                text: `ยินดีต้อนรับคุณ ${username}`,
                icon: 'success',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true
            }).then(() => {
                // ตรวจสอบ Role และเปลี่ยนหน้าตามโครงสร้างไฟล์จริง
                if (data.role === 'admin') {
                    window.location.href = "admin.html"; // ไปหน้า Admin Dashboard
                } else {
                    // เปลี่ยนจาก index.html เป็น complaint.html ตามโครงสร้างไฟล์ของคุณ
                    window.location.href = "complaint.html"; 
                }
            });

        } else {
            Swal.fire({
                title: 'เข้าสู่ระบบไม่สำเร็จ',
                text: data.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
                icon: 'error',
                confirmButtonColor: '#1e8449'
            });
        }
    } catch (err) {
        Swal.fire({
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้',
            icon: 'warning'
        });
        console.error(err);
    }
});