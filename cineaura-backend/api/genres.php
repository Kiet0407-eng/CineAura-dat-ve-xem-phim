<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/db.php';

try {
    // Thử lấy dữ liệu từ bảng genres
    $stmt = $conn->prepare("SELECT * FROM genres ORDER BY name ASC");
    $stmt->execute();
    $genres = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($genres) > 0) {
        echo json_encode($genres);
    } else {
        throw new Exception("Empty table");
    }
} catch (Exception $e) {
    // Nếu chưa có bảng genres, tự động trả về danh sách chuẩn này
    $default_genres = [
        ["id" => 1, "name" => "Hành động, Bom tấn"],
        ["id" => 2, "name" => "Tình cảm, Lãng mạn"],
        ["id" => 3, "name" => "Kinh dị, Hồi hộp"],
        ["id" => 4, "name" => "Hài hước, Gia đình"],
        ["id" => 5, "name" => "Khoa học viễn tưởng"],
        ["id" => 6, "name" => "Hành động, IMAX"],
        ["id" => 7, "name" => "Hoạt hình, Anime"]
    ];
    echo json_encode($default_genres);
}
?>