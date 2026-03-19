window.onload = function () {
    const submitBtn = document.getElementById("submitBtn");
    const complaintForm = document.getElementById("complaintForm");

    // เช็คใน Console ว่า JS โหลดพอร์ตปุ่มเจอไหม
    if (!submitBtn) {
        console.error("❌ หาปุ่มที่มี id='submitBtn' ไม่เจอในไฟล์ HTML!");
    } else {
        console.log("✅ เชื่อมต่อปุ่มส่งเรื่องเรียบร้อย");
    }

    // จัดการชื่อไฟล์รูปภาพ
    document.getElementById("image").addEventListener("change", function () {
        const fileName = this.files[0]?.name || "ยังไม่ได้เลือกไฟล์";
        document.getElementById("fileName").textContent = fileName;
    });

    // ✅ ดักจับที่ปุ่มเพิ่มอีกทาง 
    submitBtn.addEventListener("click", async function (e) {
        e.preventDefault();
        e.stopPropagation();
        await submitComplaint();
        return false;
    });

    async function submitComplaint() {
        const name = document.getElementById('name').value;
        const type = document.getElementById('type').value;
        const detail = document.getElementById('detail').value;
        const imageFile = document.getElementById('image').files[0];

        if (!name || !type) {
            alert("กรุณากรอกชื่อและประเภทปัญหา");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("type", type);
        formData.append("detail", detail);
        if (imageFile) formData.append("image", imageFile);

        try {
            submitBtn.disabled = true;
            submitBtn.innerText = "กำลังส่ง...";

            const response = await axios.post('http://localhost:8000/complaints', formData);

            if (response.status === 200) {
                const id = response.data.complaintId;
                const resultContainer = document.getElementById('result-container');

                // 1. ใส่เลขคิวก่อน
                document.getElementById('queue-number').innerText = id;

                // 2. แสดงกล่องสีเขียว
                resultContainer.style.display = 'block';
                console.log("ส่งสำเร็จ! เลขคิวคือ:", id);

                // 3. ล้างฟอร์มเป็นลำดับสุดท้าย
                complaintForm.reset();
                document.getElementById("fileName").textContent = "ยังไม่ได้เลือกไฟล์";
            }
            } catch (error) {
                console.error("Error details:", error);
                alert("ส่งไม่สำเร็จ: " + (error.response?.data?.message || error.message));
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = "ส่งเรื่อง";
            }
        }
};