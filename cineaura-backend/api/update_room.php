<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
include_once '../config/db.php';

$id = $_POST['id'] ?? '';
$theater_id = $_POST['theater_id'] ?? '';
$name = $_POST['name'] ?? '';
$capacity = $_POST['capacity'] ?? '';

if(!empty($id) && !empty($theater_id) && !empty($name)) {
    $stmt = $conn->prepare("UPDATE rooms SET theater_id = :theater_id, name = :name, capacity = :capacity WHERE id = :id");
    $stmt->execute([':id' => $id, ':theater_id' => $theater_id, ':name' => $name, ':capacity' => $capacity]);
    echo json_encode(["success" => true, "message" => "Cập nhật phòng thành công!"]);
}
?>