<?php
// Báo cho trình duyệt biết file này trả về dữ liệu dạng JSON
header("Content-Type: application/json; charset=UTF-8");

// Nhúng file kết nối CSDL
include_once '../config/db.php';

// Câu lệnh SQL lấy tất cả phim
$query = "SELECT * FROM movies ORDER BY id DESC";
$stmt = $conn->prepare($query);
$stmt->execute();

$movies_arr = array();

// Duyệt qua từng dòng dữ liệu và đưa vào mảng
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    array_push($movies_arr, $row);
}

// Ép mảng thành chuỗi JSON và in ra
echo json_encode($movies_arr);
?>