<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
include_once '../config/db.php';

$name = $_POST['name'] ?? '';
$address = $_POST['address'] ?? '';
$city = $_POST['city'] ?? '';

if(!empty($name) && !empty($address)) {
    $stmt = $conn->prepare("INSERT INTO theaters (name, address, city) VALUES (:name, :address, :city)");
    $stmt->execute([':name' => $name, ':address' => $address, ':city' => $city]);
    echo json_encode(["success" => true, "message" => "Thêm rạp thành công!"]);
} else {
    echo json_encode(["success" => false, "message" => "Thiếu thông tin."]);
}
?>