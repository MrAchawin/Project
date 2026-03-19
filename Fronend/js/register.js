document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const statusMsg = document.getElementById('registerStatusMessage');

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
            // ✅ แสดงข้อความสำเร็จเป็นสีเขียว
            statusMsg.style.color = "#28a745";
            statusMsg.innerText = "🎉 สมัครสมาชิกสำเร็จ!";

            // หน่วงเวลา 2 วินาทีเพื่อให้ User อ่านข้อความก่อนเปลี่ยนหน้า
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            const data = await res.json();
            // ❌ แสดงข้อความ Error เป็นสีแดง
            statusMsg.style.color = "#dc3545";
            statusMsg.innerText = "❌ " + (data.error || "สมัครสมาชิกไม่สำเร็จ");
        }
    }catch (err) {
            statusMsg.style.color = "#dc3545";
            statusMsg.innerText = "⚠️ ไม่สามารถติดต่อเซิร์ฟเวอร์ได้";
        }
    });