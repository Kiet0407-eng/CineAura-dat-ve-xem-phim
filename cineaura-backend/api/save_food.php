<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

$host = "localhost";
$username = "root";
$password = "";
$dbname = "cineaura_db"; // Tên database của bạn

$conn = new mysqli($host, $username, $password, $dbname);
$conn->set_charset("utf8mb4");

// Lấy dữ liệu JSON từ React gửi xuống
$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['id']) && !empty($data['tenDoAn'])) {
    
    $id = $conn->real_escape_string($data['id']);
    $tenDoAn = $conn->real_escape_string($data['tenDoAn']);
    $loai = $conn->real_escape_string($data['loai']);
    $gia = (int)$data['gia'];
    $hinhAnh = $conn->real_escape_string($data['hinhAnh']);
    $moTa = $conn->real_escape_string($data['moTa']);
    $banChay = $data['banChay'] ? 1 : 0;
    $trangThai = $conn->real_escape_string($data['trangThai']);

    // Kiểm tra xem ID này đã có trong DB chưa (Nếu có thì Sửa, chưa có thì Thêm mới)
    $check = $conn->query("SELECT id FROM foods WHERE id = '$id'");
    
    if ($check->num_rows > 0) {
        // CẬP NHẬT (UPDATE)
        $sql = "UPDATE foods SET tenDoAn='$tenDoAn', loai='$loai', gia=$gia, hinhAnh='$hinhAnh', moTa='$moTa', banChay=$banChay, trangThai='$trangThai' WHERE id='$id'";
    } else {
        // THÊM MỚI (INSERT)
        $sql = "INSERT INTO foods (id, tenDoAn, loai, gia, hinhAnh, moTa, banChay, trangThai) 
                VALUES ('$id', '$tenDoAn', '$loai', $gia, '$hinhAnh', '$moTa', $banChay, '$trangThai')";
    }

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Lưu dữ liệu thành công!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Lỗi SQL: " . $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Dữ liệu đầu vào không hợp lệ!"]);
}

$conn->close();
?>