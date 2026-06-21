<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
include_once '../config/db.php';

// Nhận dữ liệu từ React gửi lên
$theater_id = $_POST['theater_id'] ?? '';
$name = $_POST['name'] ?? '';
$capacity = $_POST['capacity'] ?? 80;
$format = $_POST['format'] ?? '2D';

if(!empty($theater_id) && !empty($name)) {
    try {
        // Chuẩn bị câu lệnh thêm vào bảng rooms
        $stmt = $conn->prepare("INSERT INTO rooms (theater_id, name, capacity, format) VALUES (:theater_id, :name, :capacity, :format)");
        
        $stmt->execute([
            ':theater_id' => $theater_id,
            ':name' => $name,
            ':capacity' => $capacity,
            ':format' => $format
        ]);
        
        echo json_encode(["success" => true, "message" => "Thêm phòng chiếu thành công!"]);
    } catch(PDOException $e) {
        // Báo lỗi chi tiết nếu MySQL chặn (VD: sai tên cột, thiếu bảng)
        echo json_encode(["success" => false, "message" => "Lỗi MySQL: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Vui lòng chọn Rạp và nhập Tên phòng!"]);
}
?>