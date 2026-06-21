<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/db.php';

// Hứng ID do React gửi lên
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id)) {
    // 1. Tìm thông tin ảnh của phim
    $query = "SELECT poster_url FROM movies WHERE id = :id";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':id', $data->id);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row && !empty($row['poster_url'])) {
        // 🔴 KIỂM TRA BẢO MẬT: Chỉ xóa file vật lý nếu ảnh đó nằm trong thư mục uploads của server
        if (strpos($row['poster_url'], 'uploads/') !== false) {
            $filename = basename($row['poster_url']); 
            $filepath = '../uploads/' . $filename;
            
            if (file_exists($filepath)) {
                unlink($filepath); 
            }
        }
    }

    // 2. Tiến hành xóa dữ liệu trong bảng movies của Database
    $deleteQuery = "DELETE FROM movies WHERE id = :id";
    $deleteStmt = $conn->prepare($deleteQuery);
    $deleteStmt->bindParam(':id', $data->id);

    if ($deleteStmt->execute()) {
        echo json_encode(array("success" => true, "message" => "Đã xóa phim thành công!"));
    } else {
        echo json_encode(array("success" => false, "message" => "Không thể xóa phim trong cơ sở dữ liệu."));
    }
} else {
    echo json_encode(array("success" => false, "message" => "Không tìm thấy ID phim cần xóa."));
}
?>