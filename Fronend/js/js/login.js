document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch('http://localhost:8000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();
        if (res.ok) {
            alert("เข้าสู่ระบบสำเร็จ!");
            // ส่งไปหน้าตาม Role
            window.location.href = (data.user.role === 'admin') ? 'admin.html' : 'complaint.html';
        } else {
            alert(data.error);
        }
    } catch (err) {
        alert("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
    }
});