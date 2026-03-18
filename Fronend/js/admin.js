// 1. ฟังก์ชันโหลดข้อมูลมาแสดงในตาราง
async function loadComplaints() {
    try {
        const res = await fetch('http://localhost:8000/admin/complaints');
        const data = await res.json();
        
        const tableBody = document.getElementById("complaintBody");
        if (!tableBody) return; 

        tableBody.innerHTML = ""; 

        data.forEach((item) => {
            const isDone = item.status === 'เสร็จสิ้น';
            const statusColor = isDone ? '#27ae60' : '#f39c12';
            const statusText = item.status || 'รอดำเนินการ';

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.type || 'ทั่วไป'}</td>
                <td>${item.detail}</td>
                <td>
                    ${item.image 
                        ? `<img src="http://localhost:8000/uploads/${item.image}" class="img-preview" onclick="viewImage(this.src)">` 
                        : '<span style="color: #ccc;">ไม่มีรูป</span>'}
                </td>
                <td><b style="color: ${statusColor}">${statusText}</b></td>
                <td>
                    ${!isDone ? `<button onclick="updateStatus(${item.id}, 'เสร็จสิ้น')" class="btn-done">✅ เสร็จสิ้น</button>` : ''}
                    <button onclick="deleteComplaint(${item.id})" class="btn-delete">🗑️ ลบ</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (err) {
        console.error("Fetch Error:", err);
    }
}

// 2. ฟังก์ชันดูรูปภาพแบบ Pop-up (ไม่เด้ง Tab ใหม่)
window.viewImage = function(src) {
    Swal.fire({
        imageUrl: src,
        imageAlt: 'Complaint Image',
        showConfirmButton: false,
        showCloseButton: true
    });
}

// 3. ฟังก์ชันอัปเดตสถานะ (Pop-up ยืนยัน)
window.updateStatus = function(id, newStatus) {
    Swal.fire({
        title: 'ยืนยันการดำเนินการ?',
        text: `คุณต้องการเปลี่ยนสถานะรายการนี้เป็น "${newStatus}" ใช่หรือไม่?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#1e8449',
        cancelButtonColor: '#7f8c8d',
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก',
        reverseButtons: true
    }).then(async (result) => {
        if (result.isConfirmed) {
            const res = await fetch(`http://localhost:8000/admin/complaints/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'อัปเดตสำเร็จ!',
                    showConfirmButton: false,
                    timer: 1500
                });
                loadComplaints(); 
            }
        }
    });
};

// 4. ฟังก์ชันลบข้อมูล (Pop-up ยืนยันสีแดง)
window.deleteComplaint = function(id) {
    Swal.fire({
        title: 'คุณแน่ใจไหม?',
        text: "ข้อมูลนี้จะหายไปถาวรและไม่สามารถกู้คืนได้!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        cancelButtonColor: '#7f8c8d',
        confirmButtonText: 'ใช่ ลบเลย!',
        cancelButtonText: 'ยกเลิก',
        reverseButtons: true
    }).then(async (result) => {
        if (result.isConfirmed) {
            const res = await fetch(`http://localhost:8000/admin/complaints/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                Swal.fire('ลบแล้ว!', 'ข้อมูลถูกลบเรียบร้อยแล้ว', 'success');
                loadComplaints(); 
            }
        }
    });
};

// 5. ฟังก์ชันออกจากระบบ
window.logout = function() {
    Swal.fire({
        title: 'ออกจากระบบ?',
        text: "คุณต้องการกลับไปยังหน้าแรกใช่ไหม?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1e8449',
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "index.html";
        }
    });
};

// เริ่มโหลดข้อมูลทันที
document.addEventListener("DOMContentLoaded", loadComplaints);