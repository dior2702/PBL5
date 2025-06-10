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
document.addEventListener('DOMContentLoaded', () => {
  // ...avatar & logout code...

  // Lấy token từ localStorage
  const token = localStorage.getItem('token');
  fetch('http://localhost:3000/api/admin/attendance/stats', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(result => {
      if (result.success && Array.isArray(result.data)) {
        const tbody = document.querySelector('#stats-table tbody');
        tbody.innerHTML = '';
        result.data.forEach(user => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${user.userId}</td>
            <td>${user.name || ''}</td>
            <td>${user.totalAttendance}</td>
            <td>${user.checkIns}</td>
            <td>${user.checkOuts}</td>
          `;
          tbody.appendChild(tr);
        });
      }
    });
});