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
            <div class="info-item">
                <button class="btn-edit" data-id="${user.userId}" title="Sửa" style="background:none;border:none;cursor:pointer;font-size:18px;">✏️</button>
                <button class="btn-delete" data-id="${user.userId}" title="Xóa" style="background:none;border:none;cursor:pointer;font-size:18px;">🗑️</button>
            </div>
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
let editingUserId = null;

// Sự kiện click nút Sửa và Xóa
document.getElementById('user-list').addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-edit')) {
        // Sửa
        const userId = e.target.getAttribute('data-id');
        const user = allUsers.find(u => u.userId === userId);
        if (!user) return;
        editingUserId = userId;
        document.getElementById('edit-name').value = user.name;
        document.getElementById('edit-email').value = user.email;
        document.getElementById('edit-phone').value = user.phone;
        document.getElementById('edit-popup').style.display = 'flex';
    }
    if (e.target.classList.contains('btn-delete')) {
        // Xóa
        const userId = e.target.getAttribute('data-id');
        if (confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
            fetch(`http://localhost:3000/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => res.json())
            .then(() => {
                // Xóa thành công, reload lại danh sách
                return fetch('http://localhost:3000/api/admin/users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            })
            .then(res => res.json())
            .then(result => {
                allUsers = result.data;
                renderUsers(allUsers);
            })
            .catch(() => alert('Xóa thất bại!'));
        }
    }
});

// Đóng popup sửa
document.getElementById('edit-cancel').onclick = function() {
    document.getElementById('edit-popup').style.display = 'none';
};

// Submit form sửa
document.getElementById('edit-form').onsubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById('edit-name').value;
    const email = document.getElementById('edit-email').value;
    const phone = document.getElementById('edit-phone').value;
    fetch(`http://localhost:3000/api/admin/users/${editingUserId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, phone })
    })
    .then(res => res.json())
    .then(() => {
        // Cập nhật thành công, reload lại danh sách
        return fetch('http://localhost:3000/api/admin/users', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    })
    .then(res => res.json())
    .then(result => {
        allUsers = result.data;
        renderUsers(allUsers);
        document.getElementById('edit-popup').style.display = 'none';
    })
    .catch(() => alert('Cập nhật thất bại!'));
};