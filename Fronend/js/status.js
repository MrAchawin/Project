async function checkStatus() {
    const id = document.getElementById("searchId").value.trim();
    const resultDiv = document.getElementById("result");

    if (!id) {
        resultDiv.innerHTML = `<div style="color:#d9534f;background:#f2dede;padding:10px;border-radius:8px;margin-top:10px;">
            กรุณากรอกเลขที่เรื่อง
        </div>`;
        return;
    }
    try {
        const { data } = await axios.get(`http://localhost:8000/complaints/${id}`);

        let imageSection = '';
        if (data.status !== 'เสร็จสิ้น' && data.image) {
            imageSection = `
                <div style="margin-top:10px;">
                    <b>รูปภาพประกอบ:</b><br>
                    <img src="http://localhost:8000/uploads/${data.image}" 
                         style="width:100%;max-width:300px;border-radius:5px;margin-top:5px;">
                </div>`;
        } else if (data.status === 'เสร็จสิ้น') {
            imageSection = `<p style="color:gray;font-size:0.9em;margin-top:10px;">
                <i>* รูปภาพถูกลบออกจากระบบเนื่องจากดำเนินการเสร็จสิ้นแล้ว</i>
            </p>`;
        }

        resultDiv.innerHTML = `
            <div style="text-align:left;padding:10px;border:1px solid #ddd;border-radius:8px;margin-top:10px;">
                <p><b>ชื่อผู้แจ้ง:</b> ${data.name}</p>
                <p><b>สถานะ:</b> <span style="color:blue;">${data.status}</span></p>
                <p><b>ประเภท:</b> ${data.type}</p>
                ${imageSection}
            </div>`;
    } catch (err) {
        resultDiv.innerHTML = `
            <div style="margin-top:20px;color:${err.response?.status === 404 ? '#333' : 'red'};">
                ${err.response?.status === 404 
                    ? 'ไม่พบข้อมูลเลขที่เรื่องนี้' 
                    : 'เกิดข้อผิดพลาดในการเชื่อมต่อ'}
            </div>`;
    }
}