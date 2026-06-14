<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
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

if (!empty($data->name) && isset($data->price) && isset($data->stock)) {
    $name = $data->name;
    $description = !empty($data->description) ? $data->description : null;
    $category = !empty($data->category) ? $data->category : null;
    $size = !empty($data->size) ? $data->size : null;
    $color = !empty($data->color) ? $data->color : null;
    $image_url = !empty($data->image_url) ? $data->image_url : null;
    $price = $data->price;
    $stock = $data->stock;

    $query = "INSERT INTO products (name, description, category, size, color, image_url, price, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($query);

    if ($stmt) {
        $stmt->bind_param("ssssssdi", $name, $description, $category, $size, $color, $image_url, $price, $stock);
        
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode([
                "success" => true,
                "message" => "Produk berhasil ditambahkan.",
                "data" => ["product_id" => $stmt->insert_id]
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Gagal menambahkan produk: " . $stmt->error,
                "data" => null
            ]);
        }
        $stmt->close();
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Database error: Gagal menyiapkan query.",
            "data" => null
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Data tidak lengkap. Field name, price, dan stock wajib diisi.",
        "data" => null
    ]);
}

$conn->close();
?>
