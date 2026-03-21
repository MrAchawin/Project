document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirmPassword").value;

    if (password !== confirm) {
        return Swal.fire({
            title: 'ผิดพลาด!',
            text: 'รหัสผ่านไม่ตรงกันใส่ใหม่',
            icon: 'error'
        });
    }
    Swal.fire({
        title: 'กำลังสมัครสมาชิก...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });
    try {
        const response = await axios.post('http://localhost:8000/register', { 
            username, 
            password 
        });

        const data = response.data;
        
        Swal.close();
        Swal.fire({
            icon: 'success',
            title: data.message || 'สมัครสมาชิกสำเร็จ!',
            showConfirmButton: false,
            timer: 1500
        });
        setTimeout(() => location.href = 'login.html', 1500);
    } catch (err) {
        Swal.close();
        const errorText = err.response?.data?.error || 'เซิร์ฟเวอร์มีปัญหา';
        Swal.fire({
            title: 'เซิร์ฟเวอร์มีปัญหานะครับบ',
            text: errorText,
            icon: 'warning'
        });
        console.error("Register Error:", err);
    }
});