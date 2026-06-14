<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';

$database = new Database();
$conn = $database->getConnection();

$product_id = isset($_GET['product_id']) ? intval($_GET['product_id']) : null;

if ($product_id) {
    $query = "SELECT r.review_id, r.user_id, r.product_id, r.rating, r.comment, r.created_at, u.username 
              FROM reviews r 
              INNER JOIN users u ON r.user_id = u.user_id 
              WHERE r.product_id = ? 
              ORDER BY r.created_at DESC";
              
    $stmt = $conn->prepare($query);
    if ($stmt) {
        $stmt->bind_param("i", $product_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $reviews = [];
        while ($row = $result->fetch_assoc()) {
            $reviews[] = [
                "review_id" => $row['review_id'],
                "user_id" => $row['user_id'],
                "username" => $row['username'],
                "product_id" => $row['product_id'],
                "rating" => intval($row['rating']),
                "comment" => $row['comment'],
                "created_at" => $row['created_at']
            ];
        }
        
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "data" => $reviews
        ]);
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
        "message" => "Parameter product_id dibutuhkan."
    ]);
}
$conn->close();
?>
