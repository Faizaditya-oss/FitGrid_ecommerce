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

$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : null;

if (!$user_id) {
    echo json_encode(array("success" => false, "message" => "user_id is required."));
    exit();
}

try {
    $query = "SELECT order_id, order_date, total_amount, status 
              FROM orders 
              WHERE user_id = ? 
              ORDER BY order_date DESC";
              
    $stmt = $db->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $orders = array();
    while ($row = $result->fetch_assoc()) {
        $orders[] = array(
            "order_id" => $row['order_id'],
            "order_date" => $row['order_date'],
            "total_amount" => $row['total_amount'],
            "status" => $row['status']
        );
    }

    echo json_encode(array(
        "success" => true,
        "data" => $orders
    ));

} catch (Exception $e) {
    echo json_encode(array(
        "success" => false,
        "message" => "Failed to fetch orders: " . $e->getMessage()
    ));
}
?>
