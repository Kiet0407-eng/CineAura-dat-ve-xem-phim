<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
include_once '../config/db.php';

$name = $_POST['name'] ?? '';
$description = $_POST['description'] ?? '';

if(!empty($name)) {
    try {
        $stmt = $conn->prepare("INSERT INTO genres (name, description) VALUES (:name, :description)");
        $stmt->execute([':name' => $name, ':description' => $description]);
        echo json_encode(["success" => true, "message" => "Thêm thể loại thành công!"]);
    } catch(PDOException $e) {
        echo json_encode(["success" => false, "message" => "Lỗi: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Vui lòng nhập tên thể loại!"]);
}
?>