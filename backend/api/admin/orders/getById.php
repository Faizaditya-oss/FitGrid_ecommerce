<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$order_id = isset($_GET['order_id']) ? $_GET['order_id'] : null;

if (!$order_id) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Order ID is required."]);
    exit();
}

// Get order details
$query = "SELECT o.*, u.username, u.email, u.phone_number, p.payment_status, p.payment_method, p.payment_proof 
          FROM orders o 
          LEFT JOIN users u ON o.user_id = u.user_id 
          LEFT JOIN payments p ON o.order_id = p.order_id
          WHERE o.order_id = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $order_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    
    $order_detail = array(
        "order_id" => $row['order_id'],
        "customer" => array(
            "user_id" => $row['user_id'],
            "username" => $row['username'],
            "email" => $row['email'],
            "phone_number" => $row['phone_number'],
            "recipient_name" => $row['recipient_name']
        ),
        "shipping_address" => $row['shipping_address'],
        "order_date" => $row['order_date'],
        "subtotal" => $row['subtotal'],
        "shipping_cost" => $row['shipping_cost'],
        "total_amount" => $row['total_amount'],
        "status" => $row['status'],
        "payment_status" => $row['payment_status'] ? $row['payment_status'] : 'Pending',
        "payment_proof" => $row['payment_proof'],
        "items" => array()
    );

    // Get order items
    $item_query = "SELECT oi.quantity, oi.price_at_purchase as price, p.name, p.image_url as image 
                   FROM order_items oi 
                   JOIN products p ON oi.product_id = p.product_id 
                   WHERE oi.order_id = ?";
    $stmt_items = $db->prepare($item_query);
    $stmt_items->bind_param("i", $order_id);
    $stmt_items->execute();
    $item_result = $stmt_items->get_result();
    
    while ($item_row = $item_result->fetch_assoc()) {
        array_push($order_detail["items"], $item_row);
    }

    echo json_encode(array(
        "success" => true,
        "data" => $order_detail
    ));
} else {
    http_response_code(404);
    echo json_encode(array(
        "success" => false,
        "message" => "Order not found."
    ));
}
?>
