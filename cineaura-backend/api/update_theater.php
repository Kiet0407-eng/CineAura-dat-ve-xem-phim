<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
include_once '../config/db.php';

$id = $_POST['id'] ?? '';
$name = $_POST['name'] ?? '';
$address = $_POST['address'] ?? '';
$city = $_POST['city'] ?? '';

if(!empty($id) && !empty($name)) {
    $stmt = $conn->prepare("UPDATE theaters SET name = :name, address = :address, city = :city WHERE id = :id");
    $stmt->execute([':id' => $id, ':name' => $name, ':address' => $address, ':city' => $city]);
    echo json_encode(["success" => true, "message" => "Cập nhật rạp thành công!"]);
}
?>