// Chấm công vào
function checkIn() {
  const base64Image = captureImage();

  fetch("http://localhost:3001/api/attendance/check-in", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify({
      image: base64Image,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Check-in successful with face verification") {
        alert("Chấm công vào thành công!");
        // Cập nhật giao diện
        updateAttendanceStatus();
      } else if (
        data.message === "Face verification failed. Check-in denied."
      ) {
        alert("Nhận diện khuôn mặt thất bại. Vui lòng thử lại.");
      }
    })
    .catch((error) => console.error("Error:", error));
}
