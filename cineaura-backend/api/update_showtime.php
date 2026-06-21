<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
include_once '../config/db.php';

$id = $_POST['id'] ?? '';
$movie_id = $_POST['movie_id'] ?? '';
$room_id = $_POST['room_id'] ?? '';
$show_date = $_POST['show_date'] ?? '';
$show_time = $_POST['show_time'] ?? '';
$price = $_POST['price'] ?? '';

if(!empty($id) && !empty($movie_id) && !empty($room_id)) {
    $stmt = $conn->prepare("UPDATE showtimes SET movie_id = :movie_id, room_id = :room_id, show_date = :show_date, show_time = :show_time, price = :price WHERE id = :id");
    $stmt->execute([
        ':id' => $id,
        ':movie_id' => $movie_id, 
        ':room_id' => $room_id, 
        ':show_date' => $show_date, 
        ':show_time' => $show_time, 
        ':price' => $price
    ]);
    echo json_encode(["success" => true, "message" => "Cập nhật suất chiếu thành công!"]);
}
?>