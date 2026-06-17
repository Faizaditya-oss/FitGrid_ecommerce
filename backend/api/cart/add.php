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
    !empty($data->product_id) &&
    !empty($data->quantity)
) {
    $user_id = $data->user_id;
    $product_id = $data->product_id;
    $quantity = $data->quantity;
    $size = isset($data->size) ? $data->size : 'Standard';
    $color = isset($data->color) ? $data->color : 'Standard';

    // Check if user has a cart
    $cart_query = "SELECT cart_id FROM carts WHERE user_id = ?";
    $stmt = $db->prepare($cart_query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $cart_result = $stmt->get_result();

    if ($cart_result->num_rows > 0) {
        $cart_row = $cart_result->fetch_assoc();
        $cart_id = $cart_row['cart_id'];
    } else {
        // Create cart for user
        $create_cart = "INSERT INTO carts (user_id) VALUES (?)";
        $stmt_create = $db->prepare($create_cart);
        $stmt_create->bind_param("i", $user_id);
        if ($stmt_create->execute()) {
            $cart_id = $db->insert_id;
        } else {
            echo json_encode(array("success" => false, "message" => "Failed to create cart."));
            exit();
        }
    }

    // Check if product with same size and color already exists in cart
    $check_item = "SELECT cart_item_id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ? AND size = ? AND color = ?";
    $stmt_check = $db->prepare($check_item);
    $stmt_check->bind_param("iiss", $cart_id, $product_id, $size, $color);
    $stmt_check->execute();
    $item_result = $stmt_check->get_result();

    if ($item_result->num_rows > 0) {
        // Update quantity
        $item_row = $item_result->fetch_assoc();
        $new_quantity = $item_row['quantity'] + $quantity;
        
        $update_item = "UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?";
        $stmt_update = $db->prepare($update_item);
        $stmt_update->bind_param("ii", $new_quantity, $item_row['cart_item_id']);
        
        if($stmt_update->execute()){
            echo json_encode(array("success" => true, "message" => "Quantity updated.", "data" => array("quantity" => $new_quantity)));
        } else {
            echo json_encode(array("success" => false, "message" => "Failed to update quantity."));
        }
    } else {
        // Insert new item
        $insert_item = "INSERT INTO cart_items (cart_id, product_id, quantity, size, color) VALUES (?, ?, ?, ?, ?)";
        $stmt_insert = $db->prepare($insert_item);
        $stmt_insert->bind_param("iiiss", $cart_id, $product_id, $quantity, $size, $color);
        
        if($stmt_insert->execute()){
            echo json_encode(array("success" => true, "message" => "Product added to cart."));
        } else {
            echo json_encode(array("success" => false, "message" => "Failed to add product."));
        }
    }
} else {
    echo json_encode(array("success" => false, "message" => "Incomplete data."));
}
?>
