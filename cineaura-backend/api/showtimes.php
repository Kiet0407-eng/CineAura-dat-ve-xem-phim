<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");
include_once '../config/db.php';

try {
    // Sắp xếp ngày gần nhất và giờ sớm nhất lên trước
    $stmt = $conn->prepare("SELECT * FROM showtimes ORDER BY show_date ASC, show_time ASC");
    $stmt->execute();
    $showtimes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($showtimes);
} catch(PDOException $e) {
    echo json_encode([]); // Nếu lỗi, trả về mảng rỗng để web không bị sập
}
?>