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

if(
    !empty($data->user_id) &&
    !empty($data->product_id)
) {
    $user_id = $data->user_id;
    $product_id = $data->product_id;
    $size = isset($data->size) ? $data->size : 'Standard';
    $color = isset($data->color) ? $data->color : 'Standard';

    // Get cart_id for the user
    $cart_query = "SELECT cart_id FROM carts WHERE user_id = ?";
    $stmt = $db->prepare($cart_query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $cart_result = $stmt->get_result();

    if ($cart_result->num_rows > 0) {
        $cart_row = $cart_result->fetch_assoc();
        $cart_id = $cart_row['cart_id'];
        
        $delete_item = "DELETE FROM cart_items WHERE cart_id = ? AND product_id = ? AND size = ? AND color = ?";
        $stmt_delete = $db->prepare($delete_item);
        $stmt_delete->bind_param("iiss", $cart_id, $product_id, $size, $color);
        
        if ($stmt_delete->execute()) {
            if ($stmt_delete->affected_rows > 0) {
                echo json_encode(array("success" => true, "message" => "Product removed from cart."));
            } else {
                echo json_encode(array("success" => false, "message" => "Product not found in cart."));
            }
        } else {
            echo json_encode(array("success" => false, "message" => "Failed to remove product."));
        }
    } else {
        echo json_encode(array("success" => false, "message" => "Cart not found for this user."));
    }
} else {
    echo json_encode(array("success" => false, "message" => "Incomplete data."));
}
?>
