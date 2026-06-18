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

$query = "SELECT o.order_id, u.username as customer_name, o.order_date, o.total_amount, o.status, p.payment_status 
          FROM orders o 
          LEFT JOIN users u ON o.user_id = u.user_id 
          LEFT JOIN payments p ON o.order_id = p.order_id
          ORDER BY o.order_date DESC";
$stmt = $db->prepare($query);
$stmt->execute();
$result = $stmt->get_result();

$orders_arr = array();
$orders_arr["success"] = true;
$orders_arr["data"] = array();

while ($row = $result->fetch_assoc()) {
    array_push($orders_arr["data"], $row);
}

echo json_encode($orders_arr);
?>
