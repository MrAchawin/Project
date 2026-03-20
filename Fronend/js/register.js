document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // ❌ รหัสผ่านไม่ตรงกัน
    if (password !== confirmPassword) {
        Swal.fire({
            title: 'ผิดพลาด!',
            text: 'รหัสผ่านไม่ตรงกัน',
            icon: 'error',
            confirmButtonColor: '#e74c3c'
        });
        return;
    }

    // 🔄 Loading
    Swal.fire({
        title: 'กำลังสมัครสมาชิก...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        const res = await fetch('http://localhost:8000/register', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();
        Swal.close(); // ปิด loading

        if (res.ok) {
            // 🎉 สำเร็จ (toast)
            Swal.fire({
                icon: 'success',
                title: 'สมัครสมาชิกสำเร็จ!',
                showConfirmButton: false,
                timer: 1800,
                timerProgressBar: true
            });

            // ⏳ หน่วงก่อนเปลี่ยนหน้า
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1800);

        } else {
            // ❌ error จาก server
            Swal.fire({
                title: 'สมัครไม่สำเร็จ',
                text: data.error || 'เกิดข้อผิดพลาด',
                icon: 'error',
                confirmButtonColor: '#e74c3c'
            });
        }

    } catch (err) {
        Swal.close();

        // ⚠️ server error
        Swal.fire({
            title: 'เซิร์ฟเวอร์มีปัญหา',
            text: 'ไม่สามารถติดต่อได้',
            icon: 'warning',
            confirmButtonColor: '#f39c12'
        });

        console.error(err);
    }
});