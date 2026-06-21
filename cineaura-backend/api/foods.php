<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");

// Sửa lại thông tin kết nối DB của bạn ở đây
$host = "localhost";
$username = "root";
$password = "";
$dbname = "cineaura_db"; // Tên database của bạn

$conn = new mysqli($host, $username, $password, $dbname);
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Lỗi kết nối CSDL"]));
}

$sql = "SELECT * FROM foods ORDER BY id DESC";
$result = $conn->query($sql);

$foods = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Ép kiểu dữ liệu cho khớp với React Frontend
        $row['gia'] = (int)$row['gia'];
        $row['banChay'] = (bool)$row['banChay'];
        array_push($foods, $row);
    }
}

echo json_encode($foods);
$conn->close();
?>