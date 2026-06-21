<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
include_once '../config/db.php';

// Lấy dữ liệu dạng text
$id = $_POST['id'] ?? '1'; 
$full_name = $_POST['full_name'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$role = $_POST['role'] ?? 'USER';
$avatar_url = $_POST['avatar_url'] ?? ''; 

if(!empty($id) && !empty($full_name) && !empty($email)) {
    
    // 1. XỬ LÝ UPLOAD ẢNH (Sử dụng đường dẫn tuyệt đối)
    if(isset($_FILES['avatar_file']) && $_FILES['avatar_file']['error'] === UPLOAD_ERR_OK) {
        // Dùng __DIR__ để PHP luôn tìm đúng thư mục gốc của Backend, dù chạy ở đâu
        $upload_dir = __DIR__ . '/../uploads/';
        
        // Tự động tạo thư mục nếu chưa có
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        
        // Lấy đuôi file (jpg, png...) để đổi tên cho chuẩn
        $file_extension = pathinfo($_FILES['avatar_file']['name'], PATHINFO_EXTENSION);
        $file_name = 'user_' . $id . '_' . time() . '.' . $file_extension;
        $target_path = $upload_dir . $file_name;

        // Di chuyển file từ bộ nhớ tạm vào thư mục uploads
        if(move_uploaded_file($_FILES['avatar_file']['tmp_name'], $target_path)) {
            // Cập nhật lại đường dẫn URL
            $avatar_url = 'http://localhost:8080/cineaura-backend/uploads/' . $file_name;
        } else {
            // Báo lỗi thẳng lên React nếu máy chủ không cho phép lưu file
            echo json_encode(["success" => false, "message" => "Lỗi: Máy chủ không cho phép lưu file vào thư mục uploads!"]);
            exit;
        }
    }

    // 2. CHUẨN BỊ CÂU LỆNH SQL
    $update_avatar_sql = "";
    $params = [
        ':id' => $id,
        ':full_name' => $full_name, 
        ':email' => $email, 
        ':phone' => $phone, 
        ':role' => $role
    ];

    // Chỉ cập nhật cột avatar nếu có link mới hoặc file mới
    if (!empty($avatar_url)) {
        $update_avatar_sql = ", avatar = :avatar";
        $params[':avatar'] = $avatar_url;
    }

    // 3. THỰC THI LƯU VÀO MYSQL
    try {
        $sql = "UPDATE users SET full_name = :full_name, email = :email, phone = :phone, role = :role" . $update_avatar_sql . " WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        
        echo json_encode([
            "success" => true, 
            "message" => "Cập nhật thành công!",
            "new_avatar" => $avatar_url // Trả về link ảnh thật cho React hiển thị
        ]);
    } catch(PDOException $e) {
         echo json_encode(["success" => false, "message" => "Lỗi CSDL: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Vui lòng nhập đủ Họ tên và Email!"]);
}
?>