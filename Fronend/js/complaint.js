document.getElementById("image").addEventListener("change", function () {
    const fileName = this.files[0]?.name || "ยังไม่ได้เลือกไฟล์";
    document.getElementById("fileName").textContent = fileName;
});

document.getElementById("complaintForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    await submitComplaint();
});

async function submitComplaint() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const type = document.getElementById('type').value;
    const detail = document.getElementById('detail').value;
    const imageFile = document.getElementById('image').files[0];

    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("type", type);
    formData.append("detail", detail);

    if (imageFile) {
        formData.append("image", imageFile);
    }

    try {
        const response = await axios.post(
            'http://localhost:8000/complaints',
            formData
        );

        if (response.status === 200) {
            alert("ส่งเรื่องสำเร็จ!");
            location.reload();
        }

    } catch (error) {
        console.error(error);
        alert("ส่งไม่สำเร็จ");
    }
}