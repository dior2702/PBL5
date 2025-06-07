// Sử dụng webcam để chụp ảnh
async function startWebcam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: 640,
        height: 480,
        facingMode: "user", // camera trước (selfie)
      },
    });

    const videoElement = document.getElementById("webcam");
    videoElement.srcObject = stream;
  } catch (error) {
    console.error("Không thể truy cập webcam:", error);
  }
}

// Chụp ảnh từ webcam và chuyển thành base64
function captureImage() {
  const videoElement = document.getElementById("webcam");
  const canvasElement = document.getElementById("canvas");

  // Thiết lập kích thước canvas bằng với video
  canvasElement.width = videoElement.videoWidth;
  canvasElement.height = videoElement.videoHeight;

  // Vẽ frame hiện tại từ video lên canvas
  const context = canvasElement.getContext("2d");
  context.drawImage(
    videoElement,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );

  // Chuyển đổi canvas thành base64
  const base64Image = canvasElement.toDataURL("image/jpeg");

  return base64Image;
}

// Đăng ký khuôn mặt
function registerFace(angle) {
  const base64Image = captureImage();
  const token = localStorage.getItem("token");
  // Log ra debug console của trình duyệt
  console.debug("Token hiện tại:", token);

  fetch("http://localhost:3000/api/face/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      faceImage: base64Image,
      angle: angle,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Face registered successfully") {
        alert("Đăng ký khuôn mặt thành công!");
        window.location.href = "Dashboard.html"; // Chuyển hướng về trang đăng ký khuôn mặt
      }
    })
    .catch((error) => console.error("Error:", error));
}