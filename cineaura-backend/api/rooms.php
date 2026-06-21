<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include_once '../config/db.php';

// Dùng JOIN để lấy tên Rạp từ bảng theaters ghép vào danh sách phòng
$query = "SELECT rooms.*, theaters.name as theater_name 
          FROM rooms 
          LEFT JOIN theaters ON rooms.theater_id = theaters.id 
          ORDER BY rooms.id DESC";
$stmt = $conn->prepare($query);
$stmt->execute();
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>