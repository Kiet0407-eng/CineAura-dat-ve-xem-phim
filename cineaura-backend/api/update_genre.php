<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
include_once '../config/db.php';

// Nhận dữ liệu từ form React gửi lên
$id = $_POST['id'] ?? '';
$name = $_POST['name'] ?? '';
$description = $_POST['description'] ?? '';

// Kiểm tra xem có truyền đủ ID và Tên thể loại mới hay không
if(!empty($id) && !empty($name)) {
    try {
        // Chuẩn bị câu lệnh SQL cập nhật dữ liệu dựa vào khóa chính ID
        $stmt = $conn->prepare("UPDATE genres SET name = :name, description = :description WHERE id = :id");
        
        $stmt->execute([
            ':id' => $id,
            ':name' => $name,
            ':description' => $description
        ]);
        
        echo json_encode(["success" => true, "message" => "Cập nhật thể loại thành công!"]);
    } catch(PDOException $e) {
        // Trả về thông báo nếu MySQL gặp lỗi (VD: sai tên cột)
        echo json_encode(["success" => false, "message" => "Lỗi cập nhật MySQL: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Thiếu thông tin ID hoặc Tên thể loại để cập nhật!"]);
}
?>