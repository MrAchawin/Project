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

                ${(data.status !== 'เสร็จสิ้น' && data.image)
                ? `<div style="margin-top: 10px;">
                 <b>รูปภาพประกอบ:</b><br>
                 <img src="http://localhost:8000/uploads/${data.image}" style="width: 100%; max-width: 300px; border-radius: 5px; margin-top: 5px;">
               </div>`
                : data.status === 'เสร็จสิ้น'
                    ? `<p style="color: gray; font-size: 0.9em; margin-top: 10px;"><i>* รูปภาพถูกลบออกจากระบบเนื่องจากดำเนินการเสร็จสิ้นแล้ว</i></p>`
                    : ''
            }
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