document.addEventListener("DOMContentLoaded", function () {
    // Dữ liệu mẫu
    const employees = [
        { name: "Phan Hùng", department: "IT", hours: 160 },
        { name: "Lê Minh", department: "HR", hours: 144 },
        { name: "Lê Nhật", department: "Finance", hours: 152 }
    ];

    // Tính tổng lương và cập nhật vào HTML
    const container = document.querySelector(".container");
    const hourlyRateElement = document.getElementById("average-hourly-rate");

    function updateSalaries() {
        // Lấy giá trị Hourly Rate từ container Hourly Rate
        const hourlyRate = parseFloat(hourlyRateElement.getAttribute("data-value"));

        // Xóa các hàng cũ (nếu có)
        const oldRows = container.querySelectorAll(".info-row:not(.header-row)");
        oldRows.forEach(row => row.remove());

        // Tính toán và hiển thị lại tổng lương
        employees.forEach(employee => {
            const salary = employee.hours * hourlyRate;

            // Định dạng lương thành tiền tệ VNĐ
            const formattedSalary = salary.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND"
            });

            // Tạo hàng HTML cho từng nhân viên
            const row = document.createElement("div");
            row.className = "info-row";
            row.innerHTML = `
                <div class="info-item">${employee.name}</div>
                <div class="info-item">${employee.department}</div>
                <div class="info-item">${employee.hours}</div>
                <div class="info-item">${formattedSalary}</div>
            `;
            container.appendChild(row);
        });
    }

    // Cập nhật lương khi trang được tải
    updateSalaries();

    // Xử lý sự kiện khi nhấn nút Change
    document.getElementById("change-hourly-rate").addEventListener("click", function () {
        const newRate = prompt("Enter the new average hourly rate (VNĐ):");
        if (newRate && !isNaN(newRate)) {
            const numericRate = parseFloat(newRate);
            hourlyRateElement.setAttribute("data-value", numericRate);
            hourlyRateElement.textContent = numericRate.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND"
            });
            updateSalaries(); // Cập nhật lại tổng lương sau khi thay đổi Hourly Rate
        } else {
            alert("Invalid input. Please enter a valid number.");
        }
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