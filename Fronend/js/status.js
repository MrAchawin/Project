async function checkStatus() {
    let id = document.getElementById("searchId").value;
    let resultDiv = document.getElementById("result");

    if (!id) {
        alert("กรุณากรอกเลขที่เรื่อง");
        return;
    }

    try {
        // ไปดึงข้อมูลจาก Backend ตาม ID ที่กรอก
        const response = await axios.get(`http://localhost:8000/complaints/${id}`);
        const data = response.data;

        // แสดงผลข้อมูลที่ดึงมาได้
        resultDiv.innerHTML = `
            <div style="text-align: left; padding: 10px; border: 1px solid #ddd; border-radius: 8px; margin-top: 10px;">
                <p><b>ชื่อผู้แจ้ง:</b> ${data.name}</p>
                <p><b>สถานะ:</b> <span style="color: blue;">${data.status}</span></p>
                <p><b>ประเภท:</b> ${data.type}</p>
            </div>
        `;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            resultDiv.innerHTML = "❌ ไม่พบข้อมูลเลขที่เรื่องนี้";
        } else {
            resultDiv.innerHTML = "เกิดข้อผิดพลาดในการเชื่อมต่อ";
        }
    }
}