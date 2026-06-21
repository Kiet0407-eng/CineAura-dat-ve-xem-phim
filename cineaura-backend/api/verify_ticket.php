<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
include_once '../config/db.php';

$ticket_code = $_POST['ticket_code'] ?? '';

if(!empty($ticket_code)) {
    // Tách lấy ID số từ chuỗi mã vé (Ví dụ: CINE-00015 -> 15)
    $id = str_replace('CINE-', '', strtoupper($ticket_code));
    $id = (int)$id;

    $stmt = $conn->prepare("SELECT * FROM bookings WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $booking = $stmt->fetch(PDO::FETCH_ASSOC);

    if($booking) {
        if($booking['status'] === 'PAID') {
            // HỢP LỆ: Đổi trạng thái vé thành USED (Đã sử dụng)
            $update = $conn->prepare("UPDATE bookings SET status = 'USED' WHERE id = :id");
            $update->execute([':id' => $id]);
            echo json_encode(["success" => true, "message" => "VÉ HỢP LỆ! Khách hàng được phép vào rạp."]);
        } else if ($booking['status'] === 'USED') {
            // LỖI: Tránh trường hợp chụp màn hình vé gửi cho người khác dùng chung
            echo json_encode(["success" => false, "message" => "CẢNH BÁO: Vé này ĐÃ ĐƯỢC QUÉT SỬ DỤNG trước đó!"]);
        } else {
            echo json_encode(["success" => false, "message" => "Vé không hợp lệ (Trạng thái: " . $booking['status'] . ")."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "VÉ GIẢ: Không tìm thấy mã vé này trên hệ thống!"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Vui lòng nhập mã vé."]);
}
?>