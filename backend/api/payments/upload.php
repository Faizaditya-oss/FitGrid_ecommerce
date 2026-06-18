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

$order_id = isset($_POST['order_id']) ? $_POST['order_id'] : null;
$payment_method = isset($_POST['payment_method']) ? $_POST['payment_method'] : null;

if (!$order_id || !$payment_method || !isset($_FILES['payment_proof'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Incomplete data. Provide order_id, payment_method, and payment_proof."]);
    exit();
}

$file = $_FILES['payment_proof'];
$allowed_extensions = ['jpg', 'jpeg', 'png', 'pdf'];
$max_size = 5 * 1024 * 1024; // 5 MB

$file_ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
$file_size = $file['size'];

if (!in_array($file_ext, $allowed_extensions)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid file format. Allowed formats: jpg, jpeg, png, pdf."]);
    exit();
}

if ($file_size > $max_size) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "File size exceeds 5MB limit."]);
    exit();
}

// Upload directory
$target_dir = __DIR__ . "/../../uploads/payments/";
if (!is_dir($target_dir)) {
    mkdir($target_dir, 0777, true);
}

// Rename file to prevent conflict
$new_filename = "payment_" . $order_id . "_" . time() . "." . $file_ext;
$target_file = $target_dir . $new_filename;

if (move_uploaded_file($file['tmp_name'], $target_file)) {
    $payment_proof_path = "/uploads/payments/" . $new_filename;
    
    // Check if payment record exists
    $check_query = "SELECT payment_id FROM payments WHERE order_id = ?";
    $stmt_check = $db->prepare($check_query);
    $stmt_check->bind_param("i", $order_id);
    $stmt_check->execute();
    $result_check = $stmt_check->get_result();
    
    try {
        $db->begin_transaction();
        
        if ($result_check->num_rows > 0) {
            // Update existing payment
            $update_query = "UPDATE payments SET payment_method = ?, payment_proof = ?, payment_status = 'Unpaid' WHERE order_id = ?";
            $stmt_update = $db->prepare($update_query);
            $stmt_update->bind_param("ssi", $payment_method, $payment_proof_path, $order_id);
            $stmt_update->execute();
        } else {
            // Insert new payment
            $insert_query = "INSERT INTO payments (order_id, payment_method, payment_proof, payment_status) VALUES (?, ?, ?, 'Unpaid')";
            $stmt_insert = $db->prepare($insert_query);
            $stmt_insert->bind_param("iss", $order_id, $payment_method, $payment_proof_path);
            $stmt_insert->execute();
        }
        
        $db->commit();
        echo json_encode([
            "success" => true,
            "message" => "Payment proof uploaded"
        ]);
    } catch (Exception $e) {
        $db->rollback();
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Database error."]);
    }
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to upload file."]);
}
?>
