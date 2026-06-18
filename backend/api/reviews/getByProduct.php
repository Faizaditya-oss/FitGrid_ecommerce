<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$product_id = isset($_GET['product_id']) ? $_GET['product_id'] : die();

$query = "SELECT r.review_id, r.user_id, r.rating, r.comment, r.created_at, u.username 
          FROM reviews r 
          JOIN users u ON r.user_id = u.user_id 
          WHERE r.product_id = ? 
          ORDER BY r.created_at DESC";

$stmt = $db->prepare($query);
$stmt->bind_param("i", $product_id);
$stmt->execute();
$result = $stmt->get_result();

$reviews_arr = array();
$reviews_arr["success"] = true;
$reviews_arr["data"] = array();
$total_rating = 0;
$count = 0;

while ($row = $result->fetch_assoc()) {
    $review_item = array(
        "id" => $row['review_id'],
        "userId" => $row['user_id'],
        "username" => $row['username'],
        "rating" => $row['rating'],
        "comment" => $row['comment'],
        "date" => $row['created_at']
    );
    array_push($reviews_arr["data"], $review_item);
    $total_rating += $row['rating'];
    $count++;
}

$reviews_arr["average_rating"] = $count > 0 ? round($total_rating / $count, 1) : 0;
$reviews_arr["total_reviews"] = $count;

echo json_encode($reviews_arr);
?>
