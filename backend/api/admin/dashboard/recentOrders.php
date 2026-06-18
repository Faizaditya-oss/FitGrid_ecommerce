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

$query = "SELECT o.order_id, o.recipient_name as customer, o.total_amount, o.status, o.order_date as date 
          FROM orders o 
          ORDER BY o.order_date DESC 
          LIMIT 5";
$result = $db->query($query);

$orders = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }
}

echo json_encode(array("success" => true, "data" => $orders));
?>
