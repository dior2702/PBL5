const token = localStorage.getItem('token');

// Sự kiện tìm kiếm bằng userId qua API, có dùng token
document.querySelector('.btn-search').addEventListener('click', function () {
    const searchValue = document.getElementById('search').value.trim();
    const userList = document.getElementById('user-list');
    if (searchValue === '') {
        renderUsers(allUsers);
        return;
    }
    fetch(`http://localhost:3000/api/admin/users/${searchValue}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => {
            if (!res.ok) throw new Error('User not found');
            return res.json();
        })
        .then(result => {
            renderUsers([result.data]);
        })
        .catch(() => {
            userList.innerHTML = '<div style="text-align:center;color:red;">Không tìm thấy nhân viên</div>';
        });
});


// Hàm render danh sách nhân viên
function renderUsers(users) {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';
    users.forEach(user => {
        const row = document.createElement('div');
        row.classList.add('info-row');
        row.setAttribute('data-name', user.name);
        row.innerHTML = `
            <div class="info-item">${user.userId}</div>
            <div class="info-item">${user.name}</div>
            <div class="info-item">${user.email}</div>
            <div class="info-item">${user.phone}</div>
        `;
        userList.appendChild(row);
    });
}

// Lấy danh sách nhân viên từ API khi trang tải, có dùng token
let allUsers = [];
fetch('http://localhost:3000/api/admin/users', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
})
    .then(res => res.json())
    .then(result => {
        allUsers = result.data;
        renderUsers(allUsers);
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