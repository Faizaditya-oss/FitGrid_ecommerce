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

if($user_id) {
    // Get cart items with product details
    $query = "SELECT ci.cart_item_id, ci.product_id, ci.quantity, ci.size, ci.color, p.name, p.category, p.image_url, p.price 
              FROM cart_items ci
              JOIN carts c ON ci.cart_id = c.cart_id
              JOIN products p ON ci.product_id = p.product_id
              WHERE c.user_id = ?";
              
    $stmt = $db->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $cart_arr = array();
    
    while ($row = $result->fetch_assoc()) {
        $subtotal = $row['price'] * $row['quantity'];
        
        $cart_item = array(
            "id" => $row['product_id'] . '-' . $row['size'] . '-' . $row['color'], // Using composed ID for frontend matching
            "cart_item_id" => $row['cart_item_id'],
            "productId" => $row['product_id'],
            "name" => $row['name'],
            "category" => $row['category'],
            "image" => $row['image_url'],
            "price" => $row['price'],
            "quantity" => $row['quantity'],
            "size" => $row['size'],
            "color" => $row['color'],
            "subtotal" => $subtotal
        );
        
        array_push($cart_arr, $cart_item);
    }

    echo json_encode(array(
        "success" => true,
        "message" => "Cart retrieved successfully.",
        "data" => $cart_arr
    ));

} else {
    echo json_encode(array("success" => false, "message" => "User ID is required."));
}
?>
