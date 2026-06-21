<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$conn = new mysqli("localhost", "root", "", "cineaura_db");
$conn->set_charset("utf8mb4");

$result = $conn->query("SELECT * FROM seat_types");
$types = array();

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $row['phuThu'] = (int)$row['phuThu'];
        $types[] = $row;
    }
}

echo json_encode($types);
$conn->close();
?>