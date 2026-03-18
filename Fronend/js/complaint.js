window.onload = function () {
    // ย้าย Event Listener ทั้งหมดมาไว้ในนี้
    document.getElementById("image").addEventListener("change", function () {
        const fileName = this.files[0]?.name || "ยังไม่ได้เลือกไฟล์";
        document.getElementById("fileName").textContent = fileName;
    });
    document.getElementById("image").addEventListener("change", function () {
        if (this.files && this.files.length > 0) {
            const fileName = this.files[0].name;
            document.getElementById("fileName").textContent = fileName; // เปลี่ยนข้อความเมื่อเลือกไฟล์
        } else {
            document.getElementById("fileName").textContent = "ยังไม่ได้เลือกไฟล์";
        }
    });

    document.getElementById("complaintForm").addEventListener("submit", async function (e) {
        e.preventDefault();
        await submitComplaint();
    });

    async function submitComplaint() {
        const name = document.getElementById('name').value;
        const type = document.getElementById('type').value;
        const detail = document.getElementById('detail').value;
        const imageFile = document.getElementById('image').files[0];

        const formData = new FormData();
        formData.append("name", name);
        formData.append("type", type);
        formData.append("detail", detail);

        if (imageFile) {
            formData.append("image", imageFile);
        }
        try {
            const response = await axios.post('http://localhost:8000/complaints', formData);

            if (response.status === 200) {
                const id = response.data.complaintId; // รับค่า ID จาก Backend

                // 1. นำเลข ID ไปแสดงในหน้าเว็บแทนการ alert
                const resultContainer = document.getElementById('result-container');
                const queueNumber = document.getElementById('queue-number');

                queueNumber.innerText = id;          // ใส่เลข ID เข้าไปใน span
                resultContainer.style.display = 'block'; // สั่งให้แถบสีเขียวแสดงผล

                // 2. เคลียร์ข้อมูลในฟอร์มเพื่อให้พร้อมแจ้งเรื่องใหม่ (แต่ไม่ reload หน้า)
                document.getElementById("complaintForm").reset();
                document.getElementById("fileName").textContent = "ยังไม่ได้เลือกไฟล์";

                // หมายเหตุ: ห้ามใส่ location.reload() นะครับ เพราะเลขจะหายทันที
            }
        } catch (error) {
            console.error(error);
            alert("ส่งไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        }
    } // ปิดฟังก์ชัน submitComplaint
}




