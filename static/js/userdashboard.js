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