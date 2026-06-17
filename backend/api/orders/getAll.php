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

// Get orders
$query = "SELECT * FROM orders ORDER BY order_date DESC";
$stmt = $db->prepare($query);
$stmt->execute();
$result = $stmt->get_result();

$orders_arr = array();
$orders_arr["success"] = true;
$orders_arr["data"] = array();

while ($row = $result->fetch_assoc()) {
    $order_id = $row['order_id'];
    
    $order_item = array(
        "id" => $order_id,
        "customerId" => $row['user_id'],
        "customer" => $row['recipient_name'],
        "address" => $row['shipping_address'],
        "date" => $row['order_date'],
        "subtotal" => $row['subtotal'],
        "shipping" => $row['shipping_cost'],
        "tax" => $row['subtotal'] * 0.1, 
        "total" => $row['total_amount'],
        "orderStatus" => $row['status'],
        "paymentStatus" => $row['payment_status'], 
        "paymentMethod" => "Bank Transfer", 
        "paymentProof" => $row['payment_proof'],
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
        array_push($order_item["items"], array(
            "name" => $item_row['name'],
            "qty" => $item_row['quantity'],
            "price" => $item_row['price'],
            "image" => $item_row['image']
        ));
    }

    array_push($orders_arr["data"], $order_item);
}

echo json_encode($orders_arr);
?>
