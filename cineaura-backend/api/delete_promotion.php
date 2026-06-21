<?php
header("Access-Control-Allow-Origin: *");
$conn = new mysqli("localhost", "root", "", "cineaura_db");
$data = json_decode(file_get_contents("php://input"), true);

if(!empty($data['code'])) {
    $code = $conn->real_escape_string($data['code']);
    $conn->query("DELETE FROM promotions WHERE code = '$code'");
    echo json_encode(["success" => true]);
}
$conn->close();
?>