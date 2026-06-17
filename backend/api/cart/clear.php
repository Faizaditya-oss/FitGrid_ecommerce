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

if(!empty($data->user_id)) {
    $user_id = $data->user_id;

    // Get cart_id for the user
    $cart_query = "SELECT cart_id FROM carts WHERE user_id = ?";
    $stmt = $db->prepare($cart_query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $cart_result = $stmt->get_result();

    if ($cart_result->num_rows > 0) {
        $cart_row = $cart_result->fetch_assoc();
        $cart_id = $cart_row['cart_id'];
        
        $delete_items = "DELETE FROM cart_items WHERE cart_id = ?";
        $stmt_delete = $db->prepare($delete_items);
        $stmt_delete->bind_param("i", $cart_id);
        
        if ($stmt_delete->execute()) {
            echo json_encode(array("success" => true, "message" => "Cart cleared successfully."));
        } else {
            echo json_encode(array("success" => false, "message" => "Failed to clear cart."));
        }
    } else {
        echo json_encode(array("success" => true, "message" => "Cart is already empty or doesn't exist."));
    }
} else {
    echo json_encode(array("success" => false, "message" => "User ID is required."));
}
?>
