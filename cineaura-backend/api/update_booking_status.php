<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
include_once '../config/db.php';

$id = $_POST['id'] ?? '';
$status = $_POST['status'] ?? '';

if(!empty($id) && !empty($status)) {
    $stmt = $conn->prepare("UPDATE bookings SET status = :status WHERE id = :id");
    $stmt->execute([':id' => $id, ':status' => $status]);
    echo json_encode(["success" => true, "message" => "Cập nhật trạng thái thành công!"]);
} else {
    echo json_encode(["success" => false, "message" => "Thiếu thông tin."]);
}
?>