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

if (
    !empty($data->user_id) &&
    !empty($data->recipient_name) &&
    !empty($data->recipient_phone) &&
    !empty($data->shipping_address)
) {
    $user_id = $data->user_id;
    $recipient_name = $data->recipient_name;
    $recipient_phone = $data->recipient_phone;
    $shipping_address = $data->shipping_address;

    try {
        // Mulai transaksi
        $db->begin_transaction();

        // 1. Dapatkan cart_id untuk user ini
        $cart_query = "SELECT cart_id FROM carts WHERE user_id = ?";
        $stmt_cart = $db->prepare($cart_query);
        $stmt_cart->bind_param("i", $user_id);
        $stmt_cart->execute();
        $cart_result = $stmt_cart->get_result();

        if ($cart_result->num_rows === 0) {
            throw new Exception("Cart not found for this user.");
        }
        $cart_row = $cart_result->fetch_assoc();
        $cart_id = $cart_row['cart_id'];

        // 2. Ambil seluruh produk dari cart user
        $items_query = "
            SELECT ci.product_id, ci.quantity, p.price, p.stock 
            FROM cart_items ci 
            JOIN products p ON ci.product_id = p.product_id 
            WHERE ci.cart_id = ?
        ";
        $stmt_items = $db->prepare($items_query);
        $stmt_items->bind_param("i", $cart_id);
        $stmt_items->execute();
        $items_result = $stmt_items->get_result();

        // 3. Validasi cart tidak kosong
        if ($items_result->num_rows === 0) {
            throw new Exception("Cart is empty.");
        }

        $items = [];
        $subtotal = 0;

        while ($row = $items_result->fetch_assoc()) {
            // Validasi stock produk
            if ($row['stock'] < $row['quantity']) {
                throw new Exception("Insufficient stock for product ID: " . $row['product_id']);
            }
            $items[] = $row;
            // 4. Hitung subtotal
            $subtotal += $row['price'] * $row['quantity'];
        }

        $shipping_cost = isset($data->shipping_cost) ? (float)$data->shipping_cost : 0;
        $tax = $subtotal * 0.1;
        // Hitung total_amount otomatis (termasuk tax dan shipping)
        $total_amount = $subtotal + $shipping_cost + $tax;

        $payment_method = isset($data->payment_method) ? $data->payment_method : 'Bank Transfer';
        $order_status = ($payment_method === 'Credit Card') ? 'Processing' : 'Pending';

        // 5. Simpan ke tabel orders
        $order_query = "INSERT INTO orders (user_id, recipient_name, recipient_phone, shipping_address, subtotal, shipping_cost, total_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt_order = $db->prepare($order_query);
        $stmt_order->bind_param("isssddds", $user_id, $recipient_name, $recipient_phone, $shipping_address, $subtotal, $shipping_cost, $total_amount, $order_status);
        
        if (!$stmt_order->execute()) {
            throw new Exception("Failed to create order.");
        }
        $order_id = $stmt_order->insert_id;

        $payment_status = ($payment_method === 'Credit Card') ? 'Paid' : 'Unpaid';
        $payment_query = "INSERT INTO payments (order_id, payment_method, payment_status) VALUES (?, ?, ?)";
        $stmt_payment = $db->prepare($payment_query);
        $stmt_payment->bind_param("iss", $order_id, $payment_method, $payment_status);
        if (!$stmt_payment->execute()) {
            throw new Exception("Failed to create payment record.");
        }

        // Siapkan statement untuk order_items dan pengurangan stock
        $order_item_query = "INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)";
        $stmt_order_item = $db->prepare($order_item_query);

        $update_stock_query = "UPDATE products SET stock = stock - ? WHERE product_id = ?";
        $stmt_update_stock = $db->prepare($update_stock_query);

        foreach ($items as $item) {
            // 6. Simpan seluruh item ke tabel order_items
            $stmt_order_item->bind_param("iiid", $order_id, $item['product_id'], $item['quantity'], $item['price']);
            if (!$stmt_order_item->execute()) {
                throw new Exception("Failed to save order items.");
            }

            // 7. Kurangi stock produk sesuai quantity yang dibeli
            $stmt_update_stock->bind_param("ii", $item['quantity'], $item['product_id']);
            if (!$stmt_update_stock->execute()) {
                throw new Exception("Failed to update product stock.");
            }
        }

        // 8. Hapus seluruh cart_items user (mengosongkan cart)
        $delete_cart_query = "DELETE FROM cart_items WHERE cart_id = ?";
        $stmt_delete_cart = $db->prepare($delete_cart_query);
        $stmt_delete_cart->bind_param("i", $cart_id);
        if (!$stmt_delete_cart->execute()) {
            throw new Exception("Failed to clear cart.");
        }

        // Commit transaksi jika semua operasi berhasil
        $db->commit();

        // 9. Return order_id yang berhasil dibuat
        echo json_encode(array(
            "success" => true,
            "message" => "Checkout successful",
            "order_id" => $order_id
        ));

    } catch (Exception $e) {
        // Rollback transaksi jika terjadi kesalahan
        $db->rollback();
        echo json_encode(array(
            "success" => false,
            "message" => $e->getMessage()
        ));
    }

} else {
    echo json_encode(array(
        "success" => false,
        "message" => "Incomplete checkout data."
    ));
}
?>
