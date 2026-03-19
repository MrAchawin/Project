async function checkStatus() {
    let id = document.getElementById("searchId").value;
    let resultDiv = document.getElementById("result");

    if (!id) {
        resultDiv.innerHTML = `
            <div style="color: #d9534f; background-color: #f2dede; padding: 10px; border-radius: 8px; border: 1px solid #ebccd1; margin-top: 10px;">
                ⚠️ กรุณากรอกเลขที่เรื่อง
            </div>
        `;
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
            // หุ้มด้วย div และเพิ่ม margin เพื่อขยับตำแหน่ง
            resultDiv.innerHTML = `
                <div style="margin-top: 20px; margin-bottom: 10px; color: #333;">
                    ❌ ไม่พบข้อมูลเลขที่เรื่องนี้
                </div>
            `;
        } else {
            resultDiv.innerHTML = `
                <div style="margin-top: 20px; margin-bottom: 10px; color: red;">
                    เกิดข้อผิดพลาดในการเชื่อมต่อ
                </div>
            `;
        }
    }
}    