<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT, POST"); // Allow both PUT and POST for compatibility
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

if (!empty($data->product_id)) {
    $product_id = $data->product_id;
    
    // Check if product exists
    $check_query = "SELECT * FROM products WHERE product_id = ?";
    $check_stmt = $conn->prepare($check_query);
    $check_stmt->bind_param("i", $product_id);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();
    
    if ($check_result && $check_result->num_rows > 0) {
        $existing = $check_result->fetch_assoc();
        
        $name = isset($data->name) ? $data->name : $existing['name'];
        $description = isset($data->description) ? $data->description : $existing['description'];
        $category = isset($data->category) ? $data->category : $existing['category'];
        $size = isset($data->size) ? $data->size : $existing['size'];
        $color = isset($data->color) ? $data->color : $existing['color'];
        $image_url = isset($data->image_url) ? $data->image_url : $existing['image_url'];
        $price = isset($data->price) ? $data->price : $existing['price'];
        $stock = isset($data->stock) ? $data->stock : $existing['stock'];

        $update_query = "UPDATE products SET name = ?, description = ?, category = ?, size = ?, color = ?, image_url = ?, price = ?, stock = ? WHERE product_id = ?";
        $stmt = $conn->prepare($update_query);

        if ($stmt) {
            $stmt->bind_param("ssssssdii", $name, $description, $category, $size, $color, $image_url, $price, $stock, $product_id);
            
            if ($stmt->execute()) {
                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "message" => "Produk berhasil diperbarui.",
                    "data" => null
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    "success" => false,
                    "message" => "Gagal memperbarui produk: " . $stmt->error,
                    "data" => null
                ]);
            }
            $stmt->close();
        } else {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Database error: Gagal menyiapkan query update.",
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
