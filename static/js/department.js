// Xử lý sự kiện tìm kiếm
document.querySelector('.btn-search').addEventListener('click', function () {
    const searchValue = document.getElementById('search').value.toLowerCase();
    const rows = document.querySelectorAll('.info-row[data-name]');

    rows.forEach(row => {
        const name = row.getAttribute('data-name').toLowerCase();
        if (name.includes(searchValue)) {
            row.style.display = 'flex'; // Hiển thị hàng phù hợp
        } else {
            row.style.display = 'none'; // Ẩn hàng không phù hợp
        }
    });
});

// Hiển thị popup khi nhấn nút "Add Department"
document.querySelector('.btn-add').addEventListener('click', () => {
    document.getElementById('add-department-popup').style.display = 'flex';
});

// Ẩn popup khi nhấn nút "Cancel"
document.getElementById('cancel-popup').addEventListener('click', () => {
    document.getElementById('add-department-popup').style.display = 'none';
});

// Xử lý thêm department mới
document.getElementById('add-department-form').addEventListener('submit', (event) => {
    event.preventDefault(); // Ngăn chặn reload trang

    // Lấy giá trị từ form
    const departmentName = document.getElementById('department-name').value;
    const phoneNumber = document.getElementById('phone-number').value;

    // Tạo một hàng mới
    const newRow = document.createElement('div');
    newRow.classList.add('info-row');
    newRow.setAttribute('data-name', departmentName);
    newRow.innerHTML = `
        <div class="info-item">${departmentName}</div>
        <div class="info-item">New</div>
        <div class="info-item">${phoneNumber}</div>
    `;

    // Thêm hàng mới vào container
    document.querySelector('.container').appendChild(newRow);

    // Ẩn popup và reset form
    document.getElementById('add-department-popup').style.display = 'none';
    document.getElementById('add-department-form').reset();
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