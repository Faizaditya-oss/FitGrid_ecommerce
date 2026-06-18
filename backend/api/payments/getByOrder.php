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

$order_id = isset($_GET['order_id']) ? $_GET['order_id'] : null;

if (!$order_id) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Order ID is required."]);
    exit();
}

$query = "SELECT payment_method, payment_status, payment_proof, payment_date FROM payments WHERE order_id = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $order_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode([
        "success" => true,
        "data" => $row
    ]);
} else {
    http_response_code(404);
    echo json_encode([
        "success" => false,
        "message" => "Payment data not found for this order."
    ]);
}
?>
