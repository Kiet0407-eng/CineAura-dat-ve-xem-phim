<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include_once '../config/db.php';

// 1. Tổng doanh thu (chỉ tính đơn Đã thanh toán)
$queryRevenue = "SELECT SUM(total_price) as total_revenue FROM bookings WHERE status = 'PAID'";
$stmtRev = $conn->query($queryRevenue);
$revenue = $stmtRev->fetch(PDO::FETCH_ASSOC)['total_revenue'] ?? 0;

// 2. Tổng số vé đã bán
$queryTickets = "SELECT COUNT(*) as total_tickets FROM bookings WHERE status = 'PAID'";
$stmtTick = $conn->query($queryTickets);
$tickets = $stmtTick->fetch(PDO::FETCH_ASSOC)['total_tickets'] ?? 0;

// 3. Số lượng phim đang chiếu
$queryMovies = "SELECT COUNT(*) as active_movies FROM movies WHERE status = 'NOW_SHOWING'";
$stmtMov = $conn->query($queryMovies);
$activeMovies = $stmtMov->fetch(PDO::FETCH_ASSOC)['active_movies'] ?? 0;

// Trả về JSON tổng hợp
echo json_encode([
    "total_revenue" => (float)$revenue,
    "total_tickets" => (int)$tickets,
    "active_movies" => (int)$activeMovies
]);
?>