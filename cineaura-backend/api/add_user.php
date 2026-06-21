<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
include_once '../config/db.php';

$full_name = $_POST['full_name'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';
$phone = $_POST['phone'] ?? '';
$role = $_POST['role'] ?? 'USER';

if(!empty($full_name) && !empty($email) && !empty($password)) {
    // Mã hóa mật khẩu
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO users (full_name, email, password, phone, role) VALUES (:full_name, :email, :password, :phone, :role)");
    
    try {
        $stmt->execute([
            ':full_name' => $full_name, 
            ':email' => $email, 
            ':password' => $hashed_password, 
            ':phone' => $phone, 
            ':role' => $role
        ]);
        echo json_encode(["success" => true, "message" => "Tạo tài khoản thành công!"]);
    } catch(PDOException $e) {
        echo json_encode(["success" => false, "message" => "Email này đã tồn tại trong hệ thống."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Vui lòng nhập đủ thông tin."]);
}
?>