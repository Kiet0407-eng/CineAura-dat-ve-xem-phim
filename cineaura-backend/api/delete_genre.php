<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
include_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id)) {
    try {
        $stmt = $conn->prepare("DELETE FROM genres WHERE id = :id");
        $stmt->execute([':id' => $data->id]);
        echo json_encode(["success" => true, "message" => "Đã xóa thành công!"]);
    } catch(PDOException $e) {
        echo json_encode(["success" => false, "message" => "Lỗi xóa: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Thiếu ID để xóa."]);
}
?>