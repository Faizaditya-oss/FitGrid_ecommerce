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
    echo json_encode(array("success" => false, "message" => "order_id is required."));
    exit();
}

try {
    // 1. Ambil data utama order
    $order_query = "SELECT * FROM orders WHERE order_id = ?";
    $stmt_order = $db->prepare($order_query);
    $stmt_order->bind_param("i", $order_id);
    $stmt_order->execute();
    $order_result = $stmt_order->get_result();

    if ($order_result->num_rows === 0) {
        echo json_encode(array("success" => false, "message" => "Order not found."));
        exit();
    }

    $order_data = $order_result->fetch_assoc();

    // 2. Ambil detail item dari order_items beserta nama produk
    $items_query = "
        SELECT 
            oi.product_id, 
            p.name AS product_name, 
            oi.price_at_purchase, 
            oi.quantity,
            (oi.price_at_purchase * oi.quantity) AS item_subtotal,
            p.image_url
        FROM order_items oi
        JOIN products p ON oi.product_id = p.product_id
        WHERE oi.order_id = ?
    ";
    
    $stmt_items = $db->prepare($items_query);
    $stmt_items->bind_param("i", $order_id);
    $stmt_items->execute();
    $items_result = $stmt_items->get_result();

    $items = array();
    while ($row = $items_result->fetch_assoc()) {
        $items[] = array(
            "product_id" => $row['product_id'],
            "product_name" => $row['product_name'],
            "price_at_purchase" => $row['price_at_purchase'],
            "quantity" => $row['quantity'],
            "subtotal" => $row['item_subtotal'],
            "image_url" => $row['image_url']
        );
    }

    // Gabungkan data
    $order_data['items'] = $items;
    $order_data['tax'] = $order_data['subtotal'] * 0.1;

    echo json_encode(array(
        "success" => true,
        "data" => $order_data
    ));

} catch (Exception $e) {
    echo json_encode(array(
        "success" => false,
        "message" => "Failed to fetch order detail: " . $e->getMessage()
    ));
}
?>
