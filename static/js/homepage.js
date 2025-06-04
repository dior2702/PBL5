// Đưa các hàm openForm và closeForm ra global scope để dùng được trong HTML inline handler
function openForm(formId) {
    document.getElementById(formId).style.display = "block";
    document.getElementById("overlay").classList.add("active");
}
function closeForm(formId) {
    document.getElementById(formId).style.display = "none";
    document.getElementById("overlay").classList.remove("active");
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
