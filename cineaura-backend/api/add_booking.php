<?php
// 1. TẮT HIỂN THỊ LỖI HTML ĐỂ BẢO VỆ CHUỖI JSON
ini_set('display_errors', 0);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8"); // Báo cho React biết đây là chuẩn JSON

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as PHPMailerException;

// Bắt đầu gom tất cả ký tự rác (nếu có) vào bộ đệm
ob_start();

try {
    include_once '../config/db.php';

    // Kiểm tra xem file PHPMailer có tồn tại không
    if (!file_exists('../PHPMailer/src/Exception.php')) {
        throw new Exception("Chưa cài đặt thư viện PHPMailer! Vui lòng kiểm tra lại đường dẫn ../PHPMailer/src/");
    }

    require '../PHPMailer/src/Exception.php';
    require '../PHPMailer/src/PHPMailer.php';
    require '../PHPMailer/src/SMTP.php';

    $user_id = $_POST['user_id'] ?? null;
    $showtime_id = $_POST['showtime_id'] ?? '';
    $total_price = $_POST['total_price'] ?? 0;
    $seats = $_POST['seats'] ?? ''; 
    $email_khach = $_POST['email'] ?? 'khach@cineaura.vn';
    $ten_khach = $_POST['name'] ?? 'Khách hàng VIP';
    $ten_phim = $_POST['movie_name'] ?? 'Phim rạp CineAura';
    $status = 'PAID';

    if(empty($showtime_id) || empty($total_price) || empty($seats)) {
        throw new Exception("Thiếu dữ liệu đặt vé từ màn hình Thanh Toán gửi sang.");
    }

    // 1. LƯU VÀO CƠ SỞ DỮ LIỆU
    $stmt = $conn->prepare("INSERT INTO bookings (user_id, showtime_id, seats, total_price, status) VALUES (:user_id, :showtime_id, :seats, :total_price, :status)");
    $uid = (isset($_POST['user_id']) && is_numeric($_POST['user_id']) && $_POST['user_id'] > 0) ? (int)$_POST['user_id'] : 1;
    
    $stmt->execute([
        ':user_id' => $uid,
        ':showtime_id' => $showtime_id,
        ':seats' => $seats,
        ':total_price' => $total_price,
        ':status' => $status
    ]);
    
    $booking_id = $conn->lastInsertId();
    $cinecode = "CINE-" . str_pad($booking_id, 5, "0", STR_PAD_LEFT);
    $formatted_price = number_format($total_price, 0, ',', '.') . ' VNĐ';

    // 2. GỬI EMAIL TỰ ĐỘNG BẰNG PHPMAILER
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'kiet31544@gmail.com'; 
        $mail->Password   = 'fjsv xrpb igty veyv';    
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;
        $mail->CharSet    = 'UTF-8';

        $mail->setFrom('no-reply@cineaura.vn', 'CineAura Premium Cinema');
        $mail->addAddress($email_khach, $ten_khach);

        $mail->isHTML(true);
        $mail->Subject = "CineAura - Xác nhận đặt vé thành công: $cinecode";
        
        $htmlContent = "
        <div style='background-color: #050508; padding: 30px; font-family: Arial, sans-serif; color: #fff; border-radius: 10px;'>
            <h2 style='color: #31b1be;'>Xin chào, $ten_khach!</h2>
            <p>Mã vé của bạn là: <strong style='color: #dfa112;'>$cinecode</strong></p>
            <p>Ghế ngồi: $seats | Tổng thanh toán: $formatted_price</p>
        </div>";

        $mail->Body = $htmlContent;
        $mail->send();
        
        ob_clean(); // Dọn sạch rác
        echo json_encode(["success" => true, "message" => "Thanh toán thành công!"]);

    } catch (PHPMailerException $e) {
        ob_clean();
        echo json_encode(["success" => true, "message" => "Lưu vé thành công, nhưng lỗi gửi mail: {$mail->ErrorInfo}"]);
    }

} catch (\Throwable $e) {
    // NẾU CÓ BẤT KỲ LỖI NÀO (Ví dụ sai Database), TRẢ VỀ ĐÚNG CHUẨN JSON ĐỂ BÁO LÊN REACT
    ob_clean();
    echo json_encode([
        "success" => false, 
        "message" => "Lỗi Backend: " . $e->getMessage()
    ]);
}
?>