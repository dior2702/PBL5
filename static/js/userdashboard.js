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
  const overlay = document.getElementById('profile-dialog-overlay');
  const closeBtn = document.getElementById('close-profile-dialog');

  // Hiển thị dialog và fetch profile ngay khi load trang
  overlay.style.display = 'flex';
  const token = localStorage.getItem('token');
  if (token) {
    fetch('http://localhost:3000/api/users/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(result => {
        if (result.success && result.data) {
          const user = result.data;
          document.getElementById('profile-content').innerHTML = `
            <div class="profile-row"><span class="profile-icon">🆔</span><strong>ID:</strong> ${user.userId || ''}</div>
            <div class="profile-row"><span class="profile-icon">👤</span><strong>Name:</strong> ${user.name || ''}</div>
            <div class="profile-row"><span class="profile-icon">📧</span><strong>Email:</strong> ${user.email || ''}</div>
            <div class="profile-row"><span class="profile-icon">📞</span><strong>Phone:</strong> ${user.phone || ''}</div>
          `;
        } else {
          document.getElementById('profile-content').innerHTML = 'Không lấy được thông tin người dùng!';
        }
      })
      .catch(() => {
        document.getElementById('profile-content').innerHTML = 'Lỗi kết nối!';
      });
  }

  closeBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
  });

  // Đóng dialog khi click ra ngoài
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.style.display = 'none';
  });
});
