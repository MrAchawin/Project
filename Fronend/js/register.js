document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("รหัสผ่านไม่ตรงกัน!");
        return;
    }

    try {
        const res = await fetch('http://localhost:8000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (res.ok) {
            alert("สมัครสมาชิกสำเร็จ!");
            window.location.href = 'index.html'; // กลับหน้า Login
        } else {
            const data = await res.json();
            alert(data.error);
        }
    } catch (err) {
        alert("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
    }
});