<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
include_once '../config/db.php';

$id = $_POST['id'] ?? '';
$title = $_POST['title'] ?? '';
$duration = $_POST['duration'] ?? 120;
$description = $_POST['description'] ?? '';
$status = $_POST['status'] ?? 'NOW_SHOWING';
$genre = $_POST['genre'] ?? '';
$release_date = $_POST['release_date'] ?? null;
$trailer_url = $_POST['trailer_url'] ?? null;

// 🔴 BỔ SUNG 3 CỘT MỚI
$director = $_POST['director'] ?? '';
$rating = $_POST['rating'] ?? 9.0;
$format = $_POST['format'] ?? '2D';

if (empty($release_date)) {
    $release_date = null;
}

if(empty($id) || empty($title)) {
    echo json_encode(["success" => false, "message" => "Thiếu ID hoặc Tên phim bắt buộc!"]);
    exit;
}

try {
    $poster_url = $_POST['poster_url'] ?? null;
    
    if(isset($_FILES['poster']) && $_FILES['poster']['error'] == UPLOAD_ERR_OK) {
        $target_dir = "../uploads/";
        if(!is_dir($target_dir)) { mkdir($target_dir, 0777, true); }
        $file_name = time() . "_" . basename($_FILES["poster"]["name"]);
        $target_file = $target_dir . $file_name;
        if(move_uploaded_file($_FILES["poster"]["tmp_name"], $target_file)) {
            $poster_url = "http://localhost:8080/cineaura-backend/uploads/" . $file_name;
        }
    }

    if($poster_url) {
        $sql = "UPDATE movies SET title=:title, duration=:duration, description=:description, status=:status, genre=:genre, release_date=:release_date, trailer_url=:trailer_url, director=:director, rating=:rating, format=:format, poster_url=:poster_url WHERE id=:id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':poster_url', $poster_url);
    } else {
        $sql = "UPDATE movies SET title=:title, duration=:duration, description=:description, status=:status, genre=:genre, release_date=:release_date, trailer_url=:trailer_url, director=:director, rating=:rating, format=:format WHERE id=:id";
        $stmt = $conn->prepare($sql);
    }

    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':duration', $duration);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':status', $status);
    $stmt->bindParam(':genre', $genre);
    $stmt->bindParam(':release_date', $release_date);
    $stmt->bindParam(':trailer_url', $trailer_url);
    $stmt->bindParam(':director', $director);
    $stmt->bindParam(':rating', $rating);
    $stmt->bindParam(':format', $format);

    $stmt->execute();
    echo json_encode(["success" => true, "message" => "Đã lưu hồ sơ phim thành công!"]);

} catch(PDOException $e) {
    echo json_encode(["success" => false, "message" => "Lỗi CSDL: " . $e->getMessage()]);
}
?>