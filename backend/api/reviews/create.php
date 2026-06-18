<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->user_id) &&
    !empty($data->product_id) &&
    !empty($data->rating)
) {
    $user_id = $data->user_id;
    $product_id = $data->product_id;
    $rating = $data->rating;
    $comment = isset($data->comment) ? $data->comment : '';

    // Check if user has bought the product and order is completed
    $check_purchase_query = "SELECT o.order_id 
                             FROM orders o 
                             JOIN order_items oi ON o.order_id = oi.order_id 
                             WHERE o.user_id = ? AND oi.product_id = ? AND o.status = 'Completed'";
    $stmt_check = $db->prepare($check_purchase_query);
    $stmt_check->bind_param("ii", $user_id, $product_id);
    $stmt_check->execute();
    $result_check = $stmt_check->get_result();

    if ($result_check->num_rows == 0) {
        echo json_encode(array("success" => false, "message" => "You can only review products you have purchased and received."));
        exit();
    }

    // Check if user already reviewed the product
    $check_review_query = "SELECT review_id FROM reviews WHERE user_id = ? AND product_id = ?";
    $stmt_review = $db->prepare($check_review_query);
    $stmt_review->bind_param("ii", $user_id, $product_id);
    $stmt_review->execute();
    $result_review = $stmt_review->get_result();

    if ($result_review->num_rows > 0) {
        echo json_encode(array("success" => false, "message" => "You have already reviewed this product."));
        exit();
    }

    // Insert review
    $query = "INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)";
    $stmt = $db->prepare($query);
    $stmt->bind_param("iiis", $user_id, $product_id, $rating, $comment);

    if ($stmt->execute()) {
        echo json_encode(array("success" => true, "message" => "Review submitted successfully."));
    } else {
        echo json_encode(array("success" => false, "message" => "Unable to submit review."));
    }
} else {
    echo json_encode(array("success" => false, "message" => "Incomplete data."));
}
?>
