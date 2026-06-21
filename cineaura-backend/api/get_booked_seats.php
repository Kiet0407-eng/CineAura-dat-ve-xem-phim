<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include_once '../config/db.php';

$showtime_id = $_GET['showtime_id'] ?? '';

if(!empty($showtime_id)) {
    // Lấy tất cả các ghế của suất chiếu này (Bỏ qua những đơn đã HỦY)
    $stmt = $conn->prepare("SELECT seats FROM bookings WHERE showtime_id = :showtime_id AND status != 'CANCELLED'");
    $stmt->execute([':showtime_id' => $showtime_id]);
    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $booked_seats = [];
    foreach($bookings as $row) {
        if(!empty($row['seats'])) {
            // Tách chuỗi "A-1,A-2" thành mảng và gộp lại
            $seats_array = explode(',', $row['seats']);
            $booked_seats = array_merge($booked_seats, $seats_array);
        }
    }
    
    // Loại bỏ các ghế trùng lặp (nếu có) và trả về JSON
    echo json_encode(array_values(array_unique($booked_seats)));
} else {
    echo json_encode([]);
}
?>