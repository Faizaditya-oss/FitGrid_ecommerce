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

$query = "SELECT u.user_id as id, u.username as name, u.email, u.phone_number as phone, u.role, u.status,
          COUNT(o.order_id) as totalOrders
          FROM users u
          LEFT JOIN orders o ON u.user_id = o.user_id
          GROUP BY u.user_id
          ORDER BY u.created_at DESC";

$result = $db->query($query);

$users = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
    echo json_encode(["success" => true, "data" => $users]);
} else {
    echo json_encode(["success" => false, "message" => "Database error"]);
}
?>
