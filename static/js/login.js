document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.querySelector('#loginForm .form-container');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Lấy giá trị email và password từ form
            const email = loginForm.querySelector('input[name="email"]') 
                ? loginForm.querySelector('input[name="email"]').value 
                : loginForm.querySelector('input[name="username"]').value;
            const password = loginForm.querySelector('input[name="password"]').value;

            try {
                const response = await fetch('http://localhost:3000/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                console.log('Login response:', data);

                if (response.ok) {
    if (data.token) {
        localStorage.setItem('token', data.token);
    }
    // Kiểm tra role và điều hướng phù hợp
    
    if (data.role && data.role.trim().toLowerCase() === 'admin') {
        window.location.href = 'Dashboard.html';
    } else {
        window.location.href = 'UserDashboard.html';
    }
} else {
    alert(data.message || 'Đăng nhập thất bại!');
}
            } catch (error) {
                alert('Lỗi kết nối đến server!');
            }
        });
    }
});