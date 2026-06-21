<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include_once '../config/db.php';

$query = "SELECT b.*, u.full_name, u.email, m.title as movie_title, s.show_date, s.show_time 
          FROM bookings b
          LEFT JOIN users u ON b.user_id = u.id
          LEFT JOIN showtimes s ON b.showtime_id = s.id
          LEFT JOIN movies m ON s.movie_id = m.id
          ORDER BY b.booking_date DESC";
$stmt = $conn->prepare($query);
$stmt->execute();
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>