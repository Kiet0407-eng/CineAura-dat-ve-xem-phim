<?php
// Cấp quyền CORS cực kỳ quan trọng: Cho phép Frontend React (chạy ở cổng khác) được phép gọi API này
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$host = "localhost";
$db_name = "cineaura_db";
$username = "root"; // Mặc định của XAMPP
$password = "";     // Mặc định của XAMPP không có mật khẩu

try {
    // Sử dụng PDO để kết nối an toàn và bảo mật hơn
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name . ";charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $exception) {
    echo "Lỗi kết nối CSDL: " . $exception->getMessage();
    exit();
}
?>