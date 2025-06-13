document.addEventListener('DOMContentLoaded', () => {
  const avatar = document.querySelector('.user-avatar img');
  const userMenu = document.getElementById('user-menu');

  avatar.addEventListener('click', (event) => {
    event.stopPropagation();
    userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
  });

  document.addEventListener('click', () => {
    userMenu.style.display = 'none';
  });

  const logout = document.getElementById('logout');
  logout.addEventListener('click', () => {
    window.location.href = 'Homepage.html';
  });

  // Lấy token
  const token = localStorage.getItem('token');
  // Lấy danh sách ca làm từ API và render
  fetch('http://localhost:3000/api/admin/shifts', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(result => {
      if (result.success && result.data) {
        renderShifts(result.data);
      }
    });
});


let editingShiftId = null;
let deletingShiftId = null;
let allShifts = []; // Lưu shifts để lấy lại khi edit

// Render shifts và lưu allShifts
function renderShifts(shifts) {
  allShifts = shifts;
  const list = document.getElementById('shift-list');
  list.innerHTML = '';
  shifts.forEach(shift => {
    const row = document.createElement('div');
    row.className = 'info-row' + (shift.isActive === false ? ' inactive-shift' : '');
    row.innerHTML = `
      <div class="info-item">${shift.shiftName || ''}</div>
      <div class="info-item">${shift.shiftStart || ''}</div>
      <div class="info-item">${shift.shiftEnd || ''}</div>
      
     
      <div class="info-item">${shift.description || ''}</div>
      <div class="info-item">
        <button class="btn-edit" data-id="${shift._id}" title="Sửa" style="background:none;border:none;cursor:pointer;font-size:18px;">✏️</button>
        <button class="btn-delete" data-id="${shift._id}" title="Xóa" style="background:none;border:none;cursor:pointer;font-size:18px;">🗑️</button>
      </div>
    `;
    list.appendChild(row);
  });
}
// Xử lý sự kiện click vào nút Thêm ca
// Mở popup tạo ca
document.getElementById('btn-create-shift').onclick = function() {
  document.getElementById('create-shift-popup').style.display = 'flex';
};

// Đóng popup
document.getElementById('create-shift-close').onclick =
document.getElementById('create-shift-cancel').onclick = function() {
  document.getElementById('create-shift-popup').style.display = 'none';
};

// Xử lý submit form tạo ca
document.getElementById('create-shift-form').onsubmit = function(e) {
  e.preventDefault();
  const token = localStorage.getItem('token');
  const shiftName = document.getElementById('create-shift-name').value.trim();
  const shiftStart = document.getElementById('create-shift-start').value;
  const shiftEnd = document.getElementById('create-shift-end').value;
  const toleranceMinutes = document.getElementById('create-shift-tolerance').value.trim();
  const description = document.getElementById('create-shift-desc').value.trim();

  if (!shiftName || !shiftStart || !shiftEnd || isNaN(toleranceMinutes)) {
    showNotifyDialog('Please enter complete information!', false);
    return;
  }

  fetch('http://localhost:3000/api/admin/shifts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ shiftName, shiftStart, shiftEnd, toleranceMinutes, description })
  })
  .then(res => res.json())
  .then(result => {
    if (result.success) {
      showNotifyDialog('Tạo ca thành công!', true);
      document.getElementById('create-shift-popup').style.display = 'none';
      // Reload lại danh sách
      return fetch('http://localhost:3000/api/admin/shifts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } else {
      throw new Error(result.message || 'Tạo ca thất bại!');
    }
  })
  .then(res => res.json())
  .then(result => {
    if (result.data) renderShifts(result.data);
  })
  .catch(err => {
    showNotifyDialog(err.message || 'Create Shift Error!', false);
  });
};
// Sự kiện Edit/Delete
document.getElementById('shift-list').addEventListener('click', function(e) {
  const shiftId = e.target.getAttribute('data-id');
  if (e.target.classList.contains('btn-edit')) {
    const shift = allShifts.find(s => s._id === shiftId);
    if (!shift) return;
    editingShiftId = shiftId;
    document.getElementById('edit-shift-name').value = shift.shiftName || '';
    document.getElementById('edit-shift-start').value = shift.shiftStart || '';
    document.getElementById('edit-shift-end').value = shift.shiftEnd || '';
    document.getElementById('edit-shift-tolerance').value = shift.toleranceMinutes || 15;
    document.getElementById('edit-shift-desc').value = shift.description || '';
    document.getElementById('edit-shift-popup').style.display = 'flex';
  }
  if (e.target.classList.contains('btn-delete')) {
    const shift = allShifts.find(s => s._id === shiftId);
    deletingShiftId = shiftId;
    document.getElementById('delete-shift-message').innerText =
      `Are you sure you want to delete the shift "${shift ? shift.shiftName : ''}"?`;
    document.getElementById('delete-shift-popup').style.display = 'flex';
  }
});

// Đóng popup sửa
document.getElementById('edit-shift-cancel').onclick =
document.getElementById('edit-shift-close').onclick = function() {
  document.getElementById('edit-shift-popup').style.display = 'none';
  editingShiftId = null;
};

// Đóng popup xóa
document.getElementById('delete-shift-cancel').onclick =
document.getElementById('delete-shift-close').onclick = function() {
  document.getElementById('delete-shift-popup').style.display = 'none';
  deletingShiftId = null;
};

// Xác nhận xóa
document.getElementById('delete-shift-confirm').onclick = function() {
  if (!deletingShiftId) return;
  const token = localStorage.getItem('token');
  fetch(`http://localhost:3000/api/admin/shifts/${deletingShiftId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(result => {
    if (result.success) {
      alert(result.message); // Thông báo cho người dùng
      // Reload lại danh sách
      return fetch('http://localhost:3000/api/admin/shifts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } else {
      throw new Error(result.message || 'Xóa thất bại!');
    }
  })
  .then(res => res.json())
  .then(result => {
    renderShifts(result.data);
    document.getElementById('delete-shift-popup').style.display = 'none';
    deletingShiftId = null;
  })
  .catch(err => {
    alert(err.message || 'Xóa thất bại!');
    document.getElementById('delete-shift-popup').style.display = 'none';
    deletingShiftId = null;
  });
};
// Submit form sửa
document.getElementById('edit-shift-form').onsubmit = function(e) {
  e.preventDefault();
  const token = localStorage.getItem('token');
  const shiftName = document.getElementById('edit-shift-name').value;
  const shiftStart = document.getElementById('edit-shift-start').value;
  const shiftEnd = document.getElementById('edit-shift-end').value;
  const toleranceMinutes = document.getElementById('edit-shift-tolerance').value;
  const description = document.getElementById('edit-shift-desc').value;
  fetch(`http://localhost:3000/api/admin/shifts/${editingShiftId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ shiftName, shiftStart, shiftEnd, toleranceMinutes, description })
  })
  .then(res => res.json())
  .then(result => {
    if (result.success) {
      // Cập nhật thành công, reload lại danh sách
      return fetch('http://localhost:3000/api/admin/shifts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } else {
      throw new Error(result.message || 'Update Error!');
    }
  })
  .then(res => res.json())
  .then(result => {
    renderShifts(result.data);
    document.getElementById('edit-shift-popup').style.display = 'none';
    editingShiftId = null;
  })
  .catch(err => alert(err.message || 'Update Error!'));
};
document.getElementById('btn-user-shift-search').onclick = function() {
  const userId = document.getElementById('user-shift-userid').value.trim();
  const token = localStorage.getItem('token');
  if (!userId) {
    alert('Vui lòng nhập User ID!');
    return;
  }

  // Lấy tên user
  fetch(`http://localhost:3000/api/admin/users/${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(userResult => {
      let userName = '';
      if (userResult.success && userResult.data) {
        userName = userResult.data.name || '';
      }
      if (userName) {
        document.getElementById('user-shift-name').innerText = `${userName}`;
        document.getElementById('user-shift-info').style.display = 'flex';
      } else {
        document.getElementById('user-shift-name').innerText = 'Not Found';
        document.getElementById('user-shift-info').style.display = 'flex';
      }

      // Lấy danh sách ca
      return fetch(`http://localhost:3000/api/admin/${userId}/shifts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    })
    .then(res => res.json())
    .then(result => {
      if (result.success && result.data && result.data.length > 0) {
        renderUserShifts(result.data);
      } else {
        document.getElementById('user-shift-list').innerHTML = '<div style="padding:16px;text-align:center;color:#e74c3c;">Không có ca nào!</div>';
      }
    })
    .catch(() => {
      document.getElementById('user-shift-list').innerHTML = '<div style="padding:16px;text-align:center;color:#e74c3c;">Lỗi khi lấy dữ liệu!</div>';
      document.getElementById('user-shift-info').style.display = 'none';
    });
};

function renderUserShifts(shifts) {
  const list = document.getElementById('user-shift-list');
  list.innerHTML = '';
  shifts.forEach(shift => {
    const detail = shift.shiftDetails || {};
    const row = document.createElement('div');
    row.className = 'info-row';
    row.innerHTML = `
      <div class="info-item">${shift.shiftName || ''}</div>
      <div class="info-item">${detail.shiftStart || ''}</div>
      <div class="info-item">${detail.shiftEnd || ''}</div>
      
      <div class="info-item">${detail.description || ''}</div>
    `;
    list.appendChild(row);
  });
};
// Mở popup đăng ký ca khi bấm nút
document.getElementById('btn-user-shift-register').onclick = function() {
  document.getElementById('assign-user-id').value = document.getElementById('user-shift-userid').value.trim();
  document.getElementById('assign-shift-name').value = '';
  document.getElementById('assign-shift-popup').style.display = 'flex';
};

// Đóng popup đăng ký ca
document.getElementById('assign-shift-cancel').onclick =
document.getElementById('assign-shift-close').onclick = function() {
  document.getElementById('assign-shift-popup').style.display = 'none';
};

function showNotifyDialog(message, isSuccess = true) {
  document.getElementById('notify-title').innerText = isSuccess ? 'Thành công' : 'Thất bại';
  document.getElementById('notify-title').style.color = isSuccess ? '#27ae60' : '#e74c3c';
  document.getElementById('notify-message').innerText = message;
  document.getElementById('notify-popup').style.display = 'flex';
}

// Đóng dialog khi bấm OK
document.getElementById('notify-ok').onclick = function() {
  document.getElementById('notify-popup').style.display = 'none';
};
// Xử lý submit đăng ký ca
document.getElementById('assign-shift-form').onsubmit = function(e) {
  e.preventDefault();
  const userId = document.getElementById('assign-user-id').value.trim();
  const shiftName = document.getElementById('assign-shift-name').value.trim();
  const token = localStorage.getItem('token');
  if (!userId || !shiftName) {
    showNotifyDialog('Vui lòng nhập đầy đủ User ID và Tên ca!', false);
    return;
  }
  fetch('http://localhost:3000/api/admin/shifts/assign', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ userId, shiftName })
  })
  .then(res => res.json())
  .then(result => {
    if (result.success) {
      showNotifyDialog('Đăng ký ca thành công!', true);
      document.getElementById('assign-shift-popup').style.display = 'none';
      // Reload lại danh sách ca nhận nếu đang xem đúng user
      if (document.getElementById('user-shift-userid').value.trim() === userId) {
        document.getElementById('btn-user-shift-search').click();
      }
    } else {
      showNotifyDialog(result.message || 'Assign Shift Error!', false);
    }
  })
  .catch(err => showNotifyDialog(err.message || 'Assign Shift Error!', false));
};

// Mở popup xóa ca khi bấm nút
document.getElementById('btn-user-shift-remove').onclick = function() {
  document.getElementById('remove-user-id').value = document.getElementById('user-shift-userid').value.trim();
  document.getElementById('remove-shift-name').value = '';
  document.getElementById('remove-shift-popup').style.display = 'flex';
};

// Đóng popup xóa ca
document.getElementById('remove-shift-cancel').onclick =
document.getElementById('remove-shift-close').onclick = function() {
  document.getElementById('remove-shift-popup').style.display = 'none';
};

// Xử lý submit xóa ca
document.getElementById('remove-shift-form').onsubmit = function(e) {
  e.preventDefault();
  const userId = document.getElementById('remove-user-id').value.trim();
  const shiftName = document.getElementById('remove-shift-name').value.trim();
  const token = localStorage.getItem('token');
  if (!userId || !shiftName) {
    showNotifyDialog('Vui lòng nhập đầy đủ User ID và Tên ca!', false);
    return;
  }
  fetch('http://localhost:3000/api/admin/shifts/remove', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ userId, shiftName })
  })
  .then(res => res.json())
  .then(result => {
    if (result.success) {
      showNotifyDialog('Remove Shift Success!', true);
      document.getElementById('remove-shift-popup').style.display = 'none';
      // Reload lại danh sách ca nhận nếu đang xem đúng user
      if (document.getElementById('user-shift-userid').value.trim() === userId) {
        document.getElementById('btn-user-shift-search').click();
      }
    } else {
      showNotifyDialog(result.message || 'Remove Shift Error!', false);
    }
  })
  .catch(err => showNotifyDialog(err.message || 'Remove Shift Error!', false));
};