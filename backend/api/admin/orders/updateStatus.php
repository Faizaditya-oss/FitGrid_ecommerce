<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->order_id) && !empty($data->status)) {
    $order_id = $data->order_id;
    $status = $data->status;

    // Validate status
    $allowed_statuses = ["Pending", "Processing", "Shipped", "Completed", "Cancelled"];
    if (!in_array($status, $allowed_statuses)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid status provided."]);
        exit();
    }

    $query = "UPDATE orders SET status = ? WHERE order_id = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("si", $status, $order_id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Order status updated successfully."]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Unable to update order status."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Incomplete data. Provide order_id and status."]);
}
?>
