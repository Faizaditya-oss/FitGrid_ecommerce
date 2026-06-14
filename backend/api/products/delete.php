<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE, POST"); // Allow POST for compatibility if needed
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';

$database = new Database();
$conn = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

// If not sent via JSON body, try getting from URL parameter
$product_id = isset($data->product_id) ? $data->product_id : (isset($_GET['id']) ? $_GET['id'] : null);

if (!empty($product_id)) {
    // Check if product exists
    $check_query = "SELECT * FROM products WHERE product_id = ?";
    $check_stmt = $conn->prepare($check_query);
    $check_stmt->bind_param("i", $product_id);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();
    
    if ($check_result && $check_result->num_rows > 0) {
        $delete_query = "DELETE FROM products WHERE product_id = ?";
        $stmt = $conn->prepare($delete_query);

        if ($stmt) {
            $stmt->bind_param("i", $product_id);
            
            if ($stmt->execute()) {
                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "message" => "Produk berhasil dihapus.",
                    "data" => null
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    "success" => false,
                    "message" => "Gagal menghapus produk: " . $stmt->error,
                    "data" => null
                ]);
            }
            $stmt->close();
        } else {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Database error: Gagal menyiapkan query delete.",
                "data" => null
            ]);
        }
    } else {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Produk dengan ID tersebut tidak ditemukan.",
            "data" => null
        ]);
    }
    $check_stmt->close();
} else {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Data tidak lengkap. Field product_id wajib diisi.",
        "data" => null
    ]);
}

$conn->close();
?>
