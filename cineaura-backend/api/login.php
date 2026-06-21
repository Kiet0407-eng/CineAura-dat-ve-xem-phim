<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
include_once '../config/db.php';

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if(!empty($email) && !empty($password)) {
    // 1. THÊM CỘT 'avatar' VÀO CÂU LỆNH SELECT
    $stmt = $conn->prepare("SELECT id, full_name, email, password, role, phone, avatar FROM users WHERE email = :email");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Kiểm tra user có tồn tại và password có khớp với mã băm trong DB không
    if($user && password_verify($password, $user['password'])) {
        unset($user['password']); // Xóa password khỏi response để bảo mật
        
        // 2. CHUẨN HOÁ DỮ LIỆU CHO REACT
        // React đang dùng biến 'name' thay vì 'full_name', nên ta gán lại cho chắc chắn
        $user['name'] = $user['full_name'];
        
        // Trả về thông tin user để lưu vào Context/LocalStorage của React
        echo json_encode(["success" => true, "message" => "Đăng nhập thành công!", "user" => $user]);
    } else {
        echo json_encode(["success" => false, "message" => "Email hoặc mật khẩu không chính xác."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Vui lòng nhập email và mật khẩu."]);
}
?>