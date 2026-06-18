<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$stats = array();

// Total Revenue
$query_rev = "SELECT SUM(total_amount) as total_revenue FROM orders WHERE status != 'Cancelled'";
$res_rev = $db->query($query_rev);
$stats['totalRevenue'] = $res_rev->fetch_assoc()['total_revenue'] ?? 0;

// Total Orders
$query_ord = "SELECT COUNT(order_id) as total_orders FROM orders";
$res_ord = $db->query($query_ord);
$stats['totalOrders'] = $res_ord->fetch_assoc()['total_orders'] ?? 0;

// Total Customers
$query_cust = "SELECT COUNT(user_id) as total_customers FROM users WHERE role = 'customer'";
$res_cust = $db->query($query_cust);
$stats['totalCustomers'] = $res_cust->fetch_assoc()['total_customers'] ?? 0;

// Total Products
$query_prod = "SELECT COUNT(product_id) as total_products FROM products";
$res_prod = $db->query($query_prod);
$stats['totalProducts'] = $res_prod->fetch_assoc()['total_products'] ?? 0;

// Pending Orders
$query_pend = "SELECT COUNT(order_id) as pending FROM orders WHERE status = 'Pending'";
$res_pend = $db->query($query_pend);
$stats['pendingOrders'] = $res_pend->fetch_assoc()['pending'] ?? 0;

// Processing Orders
$query_proc = "SELECT COUNT(order_id) as processing FROM orders WHERE status = 'Processing'";
$res_proc = $db->query($query_proc);
$stats['processingOrders'] = $res_proc->fetch_assoc()['processing'] ?? 0;

// Completed Orders
$query_comp = "SELECT COUNT(order_id) as completed FROM orders WHERE status = 'Completed'";
$res_comp = $db->query($query_comp);
$stats['completedOrders'] = $res_comp->fetch_assoc()['completed'] ?? 0;

echo json_encode(array("success" => true, "data" => $stats));
?>
