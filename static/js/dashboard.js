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
function renderAttendance(attendance, allUsers, filterDate) {
    const list = document.getElementById('attendance-list');
    list.innerHTML = '';
    // Tạo map userId -> các attendance trong ngày
    const attMap = {};
    attendance.forEach(a => {
        const date = new Date(a.timestamp).toISOString().split('T')[0];
        if (!attMap[a.userId]) attMap[a.userId] = {};
        if (!attMap[a.userId][date]) attMap[a.userId][date] = [];
        attMap[a.userId][date].push(a);
    });

    // Lấy userId từ ô tìm kiếm
    const userIdFilter = document.getElementById('search-user').value.trim();

    // Nếu có nhập userId thì chỉ render user đó, không thì render tất cả
    let usersToRender = allUsers;
    if (userIdFilter) {
        usersToRender = allUsers.filter(u => u.userId === userIdFilter);
    }

    usersToRender.forEach(user => {
        const date = filterDate;
        const attArr = attMap[user.userId] && attMap[user.userId][date] ? attMap[user.userId][date] : [];
        // Tìm check_in và check_out
        const checkIn = attArr.find(a => a.type === 'check_in');
        const checkOut = attArr.find(a => a.type === 'check_out');
        let loginTime = checkIn ? new Date(checkIn.timestamp).toLocaleTimeString() : '';
        let logoutTime = checkOut ? new Date(checkOut.timestamp).toLocaleTimeString() : '';
        let status = checkIn ? 'Present' : 'Absent';
        const row = document.createElement('div');
        row.className = 'info-row';
        row.innerHTML = `
            <div class="info-item">${user.userId}</div>
            <div class="info-item">${user.name || ''}</div>
            <div class="info-item">${loginTime}</div>
            <div class="info-item">${logoutTime}</div>
            <div class="info-item">${status}</div>
        `;
        list.appendChild(row);
    });
}
// Lấy danh sách user
let allUsers = [];
fetch('http://localhost:3000/api/admin/users', {
    headers: { 'Authorization': `Bearer ${token}` }
})
.then(res => res.json())
.then(result => {
    allUsers = result.data;
});

// Hàm lấy và lọc chấm công
function fetchAttendance() {
    const date = document.getElementById('date').value;
    const userId = document.getElementById('search-user').value.trim();
    let url = 'http://localhost:3000/api/admin/attendance?';
    if (date) {
        url += `startDate=${date}T00:00:00.000Z&endDate=${date}T23:59:59.999Z&`;
    }
    if (userId) {
        url += `userId=${userId}`;
    }
    fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(result => {
        renderAttendance(result.data, allUsers, date);
    });
}

// Sự kiện lọc
document.getElementById('btn-filter').onclick = fetchAttendance;

// Thiết lập ngày mặc định là hôm nay
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toLocaleDateString('en-CA');
    document.getElementById('date').setAttribute('max', today);
    document.getElementById('date').value = today;
    setTimeout(fetchAttendance, 500); // Đợi allUsers load xong
});