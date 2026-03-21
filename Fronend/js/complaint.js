window.onload = () => {
    const submitBtn = document.getElementById("submitBtn");
    const form = document.getElementById("complaintForm");
    const fileInput = document.getElementById("image");
    const fileNameText = document.getElementById("fileName");

    if (!submitBtn) return console.error("ไม่พบปุ่ม submitBtn");
    fileInput?.addEventListener("change", () => {
        fileNameText.textContent = fileInput.files[0]?.name || "ยังไม่ได้เลือกรูปไฟล์";
    });
    submitBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        submitBtn.disabled = true; // ล็อคปุ่มกันกดซ้ำ
        submitBtn.innerText = "กำลังส่งเรื่อง...";
        await submitComplaint();
    });
    async function submitComplaint() {
        const name = document.getElementById('name').value.trim();
        const type = document.getElementById('type').value;
        const detail = document.getElementById('detail').value;
        const image = fileInput.files[0];

        if (!name || !type) {
            submitBtn.disabled = false; // ปลดล็อคถ้าลืมกรอกข้อมูล
            submitBtn.innerText = "ส่งเรื่อง";
            return Swal.fire({
                icon: 'warning',
                title: 'กรอกข้อมูลไม่ครบ',
                text: 'กรุณากรอกชื่อและปัญหา'
            });
        }
        const formData = new FormData();
        formData.append("name", name);
        formData.append("type", type);
        formData.append("detail", detail);
        if (image) formData.append("image", image);
        try {
            const { data } = await axios.post('http://localhost:8000/complaints', formData);
            document.getElementById('queue-number').innerText = data.complaintId;
            document.getElementById('result-container').style.display = 'block';
            form.reset();
            fileNameText.textContent = "ยังไม่ได้เลือกไฟล์";
        } catch (err) {
            console.error(err);
            alert("ส่งไม่สำเร็จ: " + (err.response?.data?.message || err.message));
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = "ส่งเรื่อง";
        }
    }
};