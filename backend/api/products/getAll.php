<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';

$database = new Database();
$conn = $database->getConnection();

$query = "SELECT p.*, 
          COALESCE(AVG(r.rating), 0) as average_rating, 
          COUNT(r.review_id) as total_reviews 
          FROM products p 
          LEFT JOIN reviews r ON p.product_id = r.product_id 
          GROUP BY p.product_id 
          ORDER BY p.product_id DESC";
$result = $conn->query($query);

if ($result) {
    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Berhasil mengambil semua produk.",
        "data" => $products
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Gagal mengambil data produk: " . $conn->error,
        "data" => []
    ]);
}

$conn->close();
?>
