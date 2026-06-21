<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");

$conn = new mysqli("localhost", "root", "", "cineaura_db");
$conn->set_charset("utf8mb4");

// Chỉ lấy những mã khuyến mãi ĐANG HOẠT ĐỘNG
$result = $conn->query("SELECT * FROM promotions WHERE trangThai = 'HOAT_DONG'");

$promos = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $row['mucGiam'] = (int)$row['mucGiam'];
        $row['conditional_min'] = (int)$row['conditional_min']; // Đây là giá trị đơn tối thiểu
        array_push($promos, $row);
    }
}

echo json_encode($promos);
$conn->close();
?>