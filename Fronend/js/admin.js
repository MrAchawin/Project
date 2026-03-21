const API = 'http://localhost:8000';

async function loadComplaints() {
    try {
        const response = await axios.get(`${API}/admin/complaints`);
        const data = response.data;
        const table = document.getElementById("complaintBody");

        if (!table) return;
        table.innerHTML = "";
        data.forEach(item => {
            const isDone = item.status === 'เสร็จสิ้น';

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.type || 'ทั่วไป'}</td>
                <td>${item.detail}</td>
                <td>
                    ${item.image
                    ? `<img src="${API}/uploads/${item.image}" class="img-preview" onclick="viewImage(this.src)">`
                    : '<span style="color:#ccc;">ไม่มีรูป</span>'}
                </td>
                <td><b style="color:${isDone ? '#27ae60' : '#f39c12'}">
                    ${item.status || 'รอดำเนินการ'}
                </b></td>
                <td>
                    ${!isDone ? `<button onclick="updateStatus(${item.id}, 'เสร็จสิ้น')" class="btn-done">✅ เสร็จสิ้น</button>` : ''}
                    <button onclick="deleteComplaint(${item.id})" class="btn-delete">🗑️ ลบ</button>
                </td>`;
            table.appendChild(row);
        });
    } catch (err) {
        console.error("Load Complaints Error: ", err);
    }
}
window.viewImage = (src) => Swal.fire({
    imageUrl: src,
    showConfirmButton: false,
    showCloseButton: true
});
window.updateStatus = (id, status) => {
    Swal.fire({
        title: 'ยืนยัน?',
        text: `เปลี่ยนเป็น "${status}"`,
        icon: 'question',
        showCancelButton: true
    }).then(async r => {
        if (!r.isConfirmed) return;
        const res = await axios.put(`${API}/admin/complaints/${id}/status`, { status });
        if (res.status === 200) {
            Swal.fire({ icon: 'success', title: 'สำเร็จ!', timer: 1200, showConfirmButton: false });
            loadComplaints();
        }
    });
};
window.deleteComplaint = (id) => {
    Swal.fire({
        title: 'ลบเลย?',
        text: 'ข้อมูลจะหายถาวรแน่นนนใจนะ',
        icon: 'warning',
        showCancelButton: true
    }).then(async r => {
        if (!r.isConfirmed) return;

        const res = await axios.delete(`${API}/admin/complaints/${id}`);
        if (res.status === 200) {
            Swal.fire('ลบแล้ว!', '', 'success');
            loadComplaints();
        }
    });
};
window.logout = () => {
    Swal.fire({
        title: 'ออกจากระบบ?',
        icon: 'question',
        showCancelButton: true
    }).then(r => r.isConfirmed && (location.href = "index.html"));
};

document.addEventListener("DOMContentLoaded", loadComplaints);