<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include_once '../config/db.php';

$user_id = $_GET['user_id'] ?? 1;

// Nối 3 bảng Bookings, Showtimes và Movies để lấy đầy đủ thông tin vé
$query = "SELECT b.id as booking_id, b.total_price, b.status, b.created_at, 
                 s.show_date, s.show_time, s.room_name, 
                 m.title as movie_title
          FROM bookings b
          LEFT JOIN showtimes s ON b.showtime_id = s.id
          LEFT JOIN movies m ON s.movie_id = m.id
          WHERE b.user_id = :user_id
          ORDER BY b.created_at DESC";

$stmt = $conn->prepare($query);
$stmt->execute([':user_id' => $user_id]);
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>