<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';

$database = new Database();
$conn = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->user_id) &&
    !empty($data->product_id) &&
    isset($data->rating) &&
    !empty($data->comment)
) {
    $user_id = intval($data->user_id);
    $product_id = intval($data->product_id);
    $rating = intval($data->rating);
    $comment = $conn->real_escape_string($data->comment);
    
    if ($rating < 1 || $rating > 5) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Rating harus bernilai antara 1 sampai 5."
        ]);
        exit();
    }
    
    // Check if user has already reviewed this product to avoid duplicates
    $check_query = "SELECT review_id FROM reviews WHERE user_id = ? AND product_id = ? LIMIT 1";
    $check_stmt = $conn->prepare($check_query);
    $check_stmt->bind_param("ii", $user_id, $product_id);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();
    
    if ($check_result->num_rows > 0) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Anda sudah memberikan review untuk produk ini."
        ]);
        $check_stmt->close();
        exit();
    }
    $check_stmt->close();

    // Insert review
    $query = "INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($query);
    
    if ($stmt) {
        $stmt->bind_param("iiis", $user_id, $product_id, $rating, $comment);
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode([
                "success" => true,
                "message" => "Review berhasil ditambahkan!"
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Gagal menyimpan review."
            ]);
        }
        $stmt->close();
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Gagal memproses query database."
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Data tidak lengkap. user_id, product_id, rating, dan comment wajib diisi."
    ]);
}
$conn->close();
?>
