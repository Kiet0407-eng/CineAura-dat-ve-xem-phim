<?php
// TẮT HIỂN THỊ LỖI HTML ĐỂ BẢO VỆ CHUỖI JSON
ini_set('display_errors', 0);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/db.php';

// Import các class của PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as PHPMailerException;

ob_start();

try {
    $full_name = $_POST['full_name'] ?? '';
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    if(empty($full_name) || empty($email) || empty($password)) {
        throw new Exception("Vui lòng điền đầy đủ thông tin.");
    }

    // 1. LƯU VÀO CƠ SỞ DỮ LIỆU
    $hashed_password = password_hash($password, PASSWORD_DEFAULT); // Mã hóa password
    $stmt = $conn->prepare("INSERT INTO users (full_name, email, password, role) VALUES (:full_name, :email, :password, 'USER')");
    
    try {
        $stmt->execute([':full_name' => $full_name, ':email' => $email, ':password' => $hashed_password]);
    } catch(PDOException $e) {
        ob_clean();
        echo json_encode(["success" => false, "message" => "Email này đã được sử dụng trong hệ thống."]);
        exit;
    }

    // 2. GỬI EMAIL CHÀO MỪNG BẰNG PHPMAILER
    require '../PHPMailer/src/Exception.php';
    require '../PHPMailer/src/PHPMailer.php';
    require '../PHPMailer/src/SMTP.php';

    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        // Đã sử dụng đúng email và mật khẩu ứng dụng của bạn
        $mail->Username   = 'kiet31544@gmail.com'; 
        $mail->Password   = 'fjsv xrpb igty veyv';    
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;
        $mail->CharSet    = 'UTF-8';

        $mail->setFrom('no-reply@cineaura.vn', 'CineAura Premium Cinema');
        $mail->addAddress($email, $full_name);

        $mail->isHTML(true);
        $mail->Subject = "Chào mừng bạn đến với CineAura!";
        
        // Giao diện Email chào mừng
        $htmlContent = "
        <div style='background-color: #050508; padding: 30px; font-family: Arial, sans-serif; color: #fff; border-radius: 10px; max-width: 600px; margin: auto; border: 1px solid #333;'>
            <div style='text-align: center; border-bottom: 1px solid #333; padding-bottom: 20px; margin-bottom: 20px;'>
                <h1 style='color: #dfa112; margin: 0; font-size: 28px;'>CINE<span style='color: #fff;'>AURA</span></h1>
            </div>
            <h2 style='color: #31b1be;'>Xin chào, $full_name!</h2>
            <p>Chúc mừng bạn đã đăng ký thành công tài khoản tại hệ thống rạp chiếu phim cao cấp CineAura.</p>
            <p>Tài khoản của bạn được gắn với email: <strong style='color: #dfa112;'>$email</strong></p>
            <div style='background-color: #111; padding: 15px; border-left: 4px solid #31b1be; margin-top: 20px;'>
                <p style='margin: 0; font-size: 14px; color: #aaa;'>Bây giờ bạn có thể đăng nhập để tích điểm, cập nhật hồ sơ và tận hưởng các ưu đãi dành riêng cho thành viên.</p>
            </div>
        </div>";

        $mail->Body = $htmlContent;
        $mail->send();
        
        ob_clean();
        echo json_encode(["success" => true, "message" => "Đăng ký thành công! Hãy kiểm tra hộp thư Email của bạn."]);

    } catch (PHPMailerException $e) {
        ob_clean();
        echo json_encode(["success" => true, "message" => "Đăng ký thành công, nhưng không thể gửi email: {$mail->ErrorInfo}"]);
    }

} catch (\Throwable $e) {
    ob_clean();
    echo json_encode([
        "success" => false, 
        "message" => "Lỗi Backend: " . $e->getMessage()
    ]);
}
?>