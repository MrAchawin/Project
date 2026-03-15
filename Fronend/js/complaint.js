document.getElementById("complaintForm").addEventListener("submit", async function (e) {
    e.preventDefault(); 

    await submitComplaint(); 
});
async function submitComplaint() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const type = document.getElementById('type').value;
    const detail = document.getElementById('detail').value;

    const payload = {
        name: name,
        phone: phone,
        type: type,
        detail: detail,
        image: "" 
    };
    try {
        const response = await axios.post('http://localhost:8000/complaints', payload);
        if (response.status === 200) {
            alert("ส่งข้อมูลเข้า Database สำเร็จแล้ว!");
            location.reload();
        }
    } catch (error) {
        console.error("ส่งข้อมูลไม่สำเร็จ:", error);
        alert("เกิดข้อผิดพลาด: " + (error.response ? error.response.data.message : "เชื่อมต่อ Server ไม่ได้"));
    }
}