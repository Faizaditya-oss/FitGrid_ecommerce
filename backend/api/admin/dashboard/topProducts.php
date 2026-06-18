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

$query = "SELECT p.product_id, p.name, p.price, p.image_url as image, SUM(oi.quantity) as sold 
          FROM order_items oi 
          JOIN products p ON oi.product_id = p.product_id 
          JOIN orders o ON oi.order_id = o.order_id 
          WHERE o.status != 'Cancelled' 
          GROUP BY p.product_id 
          ORDER BY sold DESC 
          LIMIT 5";
$result = $db->query($query);

$products = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
}

echo json_encode(array("success" => true, "data" => $products));
?>
