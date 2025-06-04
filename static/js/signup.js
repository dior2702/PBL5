document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signupFormElement');
    if (signupForm) {
        signupForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const data = {
                email: document.getElementById('signupEmail').value,
                password: document.getElementById('signupPassword').value,
                fullName: document.getElementById('fullName').value,
                department: document.getElementById('department').value,
                position: document.getElementById('position').value,
                employeeId: document.getElementById('employeeId').value
            };
            try {
                const res = await fetch('http://localhost:3001/api/users/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (res.ok) {
                    alert('Đăng ký thành công!');
                    closeForm('signupForm');
                } else {
                    const err = await res.json();
                    alert('Đăng ký thất bại: ' + (err.message || 'Lỗi không xác định'));
                }
            } catch (error) {
                alert('Lỗi kết nối máy chủ!');
            }
        });
    }
});