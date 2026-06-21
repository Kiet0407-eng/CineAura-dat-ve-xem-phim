<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/db.php';

$title = $_POST['title'] ?? '';
$duration = $_POST['duration'] ?? '';
$description = $_POST['description'] ?? '';
$status = $_POST['status'] ?? 'NOW_SHOWING';
$genre = $_POST['genre'] ?? '';
$release_date = $_POST['release_date'] ?? null;
$trailer_url = $_POST['trailer_url'] ?? '';

// 🔴 BỔ SUNG 3 CỘT MỚI
$director = $_POST['director'] ?? '';
$rating = $_POST['rating'] ?? 9.0;
$format = $_POST['format'] ?? '2D';

if (empty($release_date)) {
    $release_date = null;
}

$poster_url = $_POST['poster_url'] ?? ''; 

if (isset($_FILES['poster']) && $_FILES['poster']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = '../uploads/';
    if(!is_dir($uploadDir)) { mkdir($uploadDir, 0777, true); }
    $fileName = time() . '_' . basename($_FILES['poster']['name']);
    $targetPath = $uploadDir . $fileName;

    if (move_uploaded_file($_FILES['poster']['tmp_name'], $targetPath)) {
        $poster_url = 'http://localhost:8080/cineaura-backend/uploads/' . $fileName;
    }
}

if(!empty($title) && !empty($duration)) {
    // Đẩy dữ liệu vào đủ các cột trong Database
    $query = "INSERT INTO movies (title, description, poster_url, duration, status, genre, release_date, trailer_url, director, rating, format) 
              VALUES (:title, :description, :poster_url, :duration, :status, :genre, :release_date, :trailer_url, :director, :rating, :format)";
    
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':poster_url', $poster_url);
    $stmt->bindParam(':duration', $duration);
    $stmt->bindParam(':status', $status);
    $stmt->bindParam(':genre', $genre);
    $stmt->bindParam(':release_date', $release_date);
    $stmt->bindParam(':trailer_url', $trailer_url);
    $stmt->bindParam(':director', $director);
    $stmt->bindParam(':rating', $rating);
    $stmt->bindParam(':format', $format);

    if($stmt->execute()) {
        echo json_encode(array("success" => true, "message" => "Thêm phim thành công!"));
    } else {
        echo json_encode(array("success" => false, "message" => "Lỗi cơ sở dữ liệu."));
    }
} else {
    echo json_encode(array("success" => false, "message" => "Vui lòng nhập đủ Tên phim và Thời lượng."));
}
?>