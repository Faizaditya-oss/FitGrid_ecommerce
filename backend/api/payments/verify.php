<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->order_id) && !empty($data->status)) {
    $order_id = $data->order_id;
    $status = $data->status;

    $allowed_statuses = ["Paid", "Failed", "Refunded"];
    if (!in_array($status, $allowed_statuses)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid payment status."]);
        exit();
    }

    try {
        $db->begin_transaction();

        // Update payment status
        $query_payment = "UPDATE payments SET payment_status = ? WHERE order_id = ?";
        $stmt_payment = $db->prepare($query_payment);
        $stmt_payment->bind_param("si", $status, $order_id);
        
        if (!$stmt_payment->execute()) {
            throw new Exception("Failed to update payment status.");
        }

        // If status is Paid, update order status to Processing
        if ($status === 'Paid') {
            $query_order = "UPDATE orders SET status = 'Processing' WHERE order_id = ?";
            $stmt_order = $db->prepare($query_order);
            $stmt_order->bind_param("i", $order_id);
            if (!$stmt_order->execute()) {
                throw new Exception("Failed to update order status.");
            }
        }

        $db->commit();
        echo json_encode([
            "success" => true,
            "message" => "Payment verified successfully."
        ]);

    } catch (Exception $e) {
        $db->rollback();
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => $e->getMessage()
        ]);
    }

} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Incomplete data. Provide order_id and status."]);
}
?>
