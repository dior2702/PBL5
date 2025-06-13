// Xử lý sự kiện click vào các liên kết trong thanh điều hướng
const navLinks = document.querySelectorAll('.header nav ul li a');

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    // Xóa lớp active khỏi tất cả các liên kết
    navLinks.forEach(nav => nav.classList.remove('active'));
    // Thêm lớp active vào liên kết được nhấn
    link.classList.add('active');
  });
});

// Xử lý sự kiện click vào avatar để hiển thị popup
document.addEventListener('DOMContentLoaded', () => {
  const avatar = document.querySelector('.user-avatar img');
  const userMenu = document.getElementById('user-menu');

  // Hiển thị hoặc ẩn popup khi click vào avatar
  avatar.addEventListener('click', (event) => {
    event.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
    userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
  });

  // Ẩn popup khi click bên ngoài
  document.addEventListener('click', () => {
    userMenu.style.display = 'none';
  });

  // Xử lý đăng xuất
  const logout = document.getElementById('logout');
  logout.addEventListener('click', () => {
    window.location.href = 'Homepage.html';
  });
});
const token = localStorage.getItem('token');

// Hàm render danh sách chấm công
let allUsers = [];
function renderAttendance(attendance, allUsers) {
    const list = document.getElementById('attendance-list');
    list.innerHTML = '';

    // Gom dữ liệu chấm công theo userId
    const attMap = {};
    attendance.forEach(a => {
        if (!attMap[a.userId]) attMap[a.userId] = [];
        attMap[a.userId].push(a);
    });

    // Lọc theo userId nếu có nhập
    const userIdFilter = document.getElementById('search-user').value.trim();
    let usersToRender = allUsers;
    if (userIdFilter) {
        usersToRender = allUsers.filter(u => u.userId === userIdFilter);
    }

    usersToRender.forEach(user => {
        const attArr = attMap[user.userId] || [];

        // Tìm bản ghi chấm công mới nhất
        const latest = attArr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

        let loginTime = latest?.checkIn?.time || 'undefined';
        let logoutTime = latest?.checkOut?.time || 'undefined';
        let status = latest ? latest.status : 'Absent';
        let shift = latest ? latest.shiftName : (user.assignedShifts?.map(s => s.shiftName).join(', ') || 'None');

        const row = document.createElement('div');
        row.className = 'info-row';
        row.id = `attendance-row-${user.userId}`;
        row.innerHTML = `
            <div class="info-item">${user.userId}</div>
            <div class="info-item">${user.name || ''}</div>
            <div class="info-item">${shift}</div>
            <div class="info-item login-time">${loginTime}</div>
            <div class="info-item logout-time">${logoutTime}</div>
            <div class="info-item status">${status}</div>
        `;
        list.appendChild(row);
    });
} // <-- Đóng hàm renderAttendance TẠI ĐÂY

// ✅ Di chuyển fetchAttendance() RA NGOÀI, để toàn cục
function fetchAttendance() {
    
    const userId = document.getElementById('search-user').value.trim();
    let url = `http://localhost:3000/api/admin/attendance?`;

    if (userId) {
        url += `&userId=${userId}`;
    }

    fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(result => {
        console.log('Attendance fetched:', result.data);
        renderAttendance(result.data, allUsers);
    });
}

function updateAttendanceRow(newAttendance) {
    const userId = newAttendance.userId;
    const $row = $(`#attendance-row-${userId}`);
    if ($row.length) {
        const loginTime = newAttendance.checkIn?.time || 'undefined';
        const logoutTime = newAttendance.checkOut?.time || 'undefined';
        const status = newAttendance.status;

        $row.find('.login-time').text(loginTime);
        $row.find('.logout-time').text(logoutTime);
        $row.find('.status').text(status);
    }
}

// Fetch all users và gọi fetchAttendance
fetch('http://localhost:3000/api/admin/users', {
    headers: { 'Authorization': `Bearer ${token}` }
})
.then(res => res.json())
.then(result => {
    allUsers = result.data;
    fetchAttendance();
});


setInterval(function() {
    
    fetch(`http://localhost:3000/api/admin/attendance`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(result => {
        // Cập nhật từng dòng nếu có check_in/check_out mới
        result.data.forEach(updateAttendanceRow);
    });
}, 3000); // Poll mỗi 3 giây


// Sự kiện lọc
document.getElementById('btn-filter').onclick = fetchAttendance;

// Thiết lập ngày mặc định là hôm nay
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').setAttribute('max', today);
    document.getElementById('date').value = today;
    // setTimeout(fetchAttendance, 500); // Đợi allUsers load xong
});