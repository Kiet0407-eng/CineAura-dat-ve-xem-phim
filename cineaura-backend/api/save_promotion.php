<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

$conn = new mysqli("localhost", "root", "", "cineaura_db");
$conn->set_charset("utf8mb4");

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['code'])) {
    $code = $conn->real_escape_string($data['code']);
    $loaiGiam = $conn->real_escape_string($data['loaiGiam']);
    $mucGiam = (int)$data['mucGiam'];
    $conditional = (int)$data['conditional'];
    $hanDung = $conn->real_escape_string($data['hanDung']);
    $trangThai = $conn->real_escape_string($data['trangThai']);

    // Kiểm tra mã đã tồn tại chưa
    $check = $conn->query("SELECT code FROM promotions WHERE code = '$code'");
    
    if ($check->num_rows > 0) {
        $sql = "UPDATE promotions SET loaiGiam='$loaiGiam', mucGiam=$mucGiam, conditional_min=$conditional, hanDung='$hanDung', trangThai='$trangThai' WHERE code='$code'";
    } else {
        $sql = "INSERT INTO promotions (code, loaiGiam, mucGiam, conditional_min, hanDung, trangThai) 
                VALUES ('$code', '$loaiGiam', $mucGiam, $conditional, '$hanDung', '$trangThai')";
    }

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Đã lưu khuyến mãi!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Lỗi CSDL: " . $conn->error]);
    }
}
$conn->close();
?>