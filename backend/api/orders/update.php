<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->order_id)) {
    $order_id = $data->order_id;
    $updates = array();
    $types = "";
    $params = array();

    if (isset($data->paymentStatus)) {
        $updates[] = "payment_status = ?";
        $types .= "s";
        $params[] = $data->paymentStatus;
    }

    if (isset($data->orderStatus)) {
        $updates[] = "status = ?";
        $types .= "s";
        $params[] = $data->orderStatus;
    }

    if (count($updates) > 0) {
        $query = "UPDATE orders SET " . implode(", ", $updates) . " WHERE order_id = ?";
        $types .= "i";
        $params[] = $order_id;

        $stmt = $db->prepare($query);
        $stmt->bind_param($types, ...$params);

        if ($stmt->execute()) {
            echo json_encode(array("success" => true, "message" => "Order updated successfully."));
        } else {
            echo json_encode(array("success" => false, "message" => "Failed to update order."));
        }
    } else {
        echo json_encode(array("success" => false, "message" => "No updates provided."));
    }
} else {
    echo json_encode(array("success" => false, "message" => "Incomplete data."));
}
?>
