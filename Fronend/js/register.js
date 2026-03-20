document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirmPassword").value;

    if (password !== confirm) {
        return Swal.fire({
            title: 'ผิดพลาด!',
            text: 'รหัสผ่านไม่ตรงกัน',
            icon: 'error'
        });
    }
    Swal.fire({
        title: 'กำลังสมัครสมาชิก...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });
    try {
        const res = await fetch('http://localhost:8000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        Swal.close();
        if (!res.ok) {
            return Swal.fire({
                title: 'สมัครไม่สำเร็จ',
                text: data.error || 'เกิดข้อผิดพลาด',
                icon: 'error'
            });
        }
        Swal.fire({
            icon: 'success',
            title: 'สมัครสมาชิกสำเร็จ!',
            showConfirmButton: false,
            timer: 1500
        });
        setTimeout(() => location.href = 'index.html', 1500);
    } catch (err) {
        Swal.close();
        Swal.fire({
            title: 'เซิร์ฟเวอร์มีปัญหา',
            text: 'ไม่สามารถติดต่อได้',
            icon: 'warning'
        });
        console.error(err);
    }
});