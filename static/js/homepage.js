// Đưa các hàm openForm và closeForm ra global scope để dùng được trong HTML inline handler
function openForm(formId) {
    document.getElementById(formId).style.display = "block";
    document.getElementById("overlay").classList.add("active");
}
function closeForm(formId) {
    document.getElementById(formId).style.display = "none";
    document.getElementById("overlay").classList.remove("active");
    // Reset icon con mắt về mặc định (ẩn)
    document.querySelectorAll('.toggle-password').forEach(function (eye) {
        const input = document.querySelector(eye.getAttribute('toggle'));
        if (input && input.type === 'text') {
            input.type = 'password';
            eye.innerHTML = '<i class="fas fa-eye"></i>';
        }
    });
    // Reset tất cả input trong form về rỗng
    const form = document.getElementById(formId);
    if (form) {
        form.querySelectorAll('input').forEach(function(input) {
            input.value = '';
        });
    }
}
window.openForm = openForm;
window.closeForm = closeForm;

// Hiển thị form đăng nhập
document.getElementById('showLoginForm').onclick = function() {
    openForm('loginForm');
};

// Hiển thị form đăng ký
document.getElementById('showSignupForm').onclick = function() {
    openForm('signupForm');
};

// Đóng form khi click overlay
document.getElementById('overlay').onclick = function() {
    closeForm('loginForm');
    closeForm('signupForm');
};
document.querySelectorAll('.toggle-password').forEach(function (eye) {
    eye.addEventListener('click', function () {
        const input = document.querySelector(this.getAttribute('toggle'));
        if (input.type === 'password') {
            input.type = 'text';
            this.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            input.type = 'password';
            this.innerHTML = '<i class="fas fa-eye"></i>';
        }
    });
});