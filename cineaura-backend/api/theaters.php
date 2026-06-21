<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include_once '../config/db.php';

$stmt = $conn->prepare("SELECT * FROM theaters ORDER BY id DESC");
$stmt->execute();
$theaters = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($theaters);
?>