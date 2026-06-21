<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
include_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"));
if(!empty($data->id)) {
    $stmt = $conn->prepare("DELETE FROM showtimes WHERE id = :id");
    $stmt->execute([':id' => $data->id]);
    echo json_encode(["success" => true, "message" => "Đã hủy suất chiếu!"]);
}
?>