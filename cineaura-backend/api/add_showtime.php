<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
include_once '../config/db.php';

$movie_id = $_POST['movie_id'] ?? null;
$room_id = $_POST['room_id'] ?? null;
$show_date = $_POST['show_date'] ?? '';
$show_time = $_POST['show_time'] ?? '';
$price = $_POST['price'] ?? 120000;

if($movie_id && $room_id && !empty($show_date) && !empty($show_time)) {
    try {
        // Kiểm tra xem room_id có thực sự tồn tại trong bảng rooms không
        $check = $conn->prepare("SELECT id FROM rooms WHERE id = ?");
        $check->execute([$room_id]);
        
        if($check->fetch()) {
            $stmt = $conn->prepare("INSERT INTO showtimes (movie_id, room_id, show_date, show_time, price) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$movie_id, $room_id, $show_date, $show_time, $price]);
            echo json_encode(["success" => true, "message" => "Thêm suất chiếu thành công!"]);
        } else {
            // Nếu không tồn tại, tự động dùng phòng đầu tiên có trong DB để tránh lỗi
            $fallback = $conn->query("SELECT id FROM rooms LIMIT 1")->fetch();
            $stmt = $conn->prepare("INSERT INTO showtimes (movie_id, room_id, show_date, show_time, price) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$movie_id, $fallback['id'], $show_date, $show_time, $price]);
            echo json_encode(["success" => true, "message" => "Đã thêm suất chiếu (Dùng phòng mặc định)."]);
        }
    } catch(PDOException $e) {
        echo json_encode(["success" => false, "message" => "Lỗi: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Thiếu thông tin Phim hoặc Phòng chiếu!"]);
}
?>