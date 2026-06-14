<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';

$database = new Database();
$conn = $database->getConnection();

if (isset($_GET['id'])) {
    $product_id = $_GET['id'];

    $query = "SELECT * FROM products WHERE product_id = ? LIMIT 1";
    $stmt = $conn->prepare($query);
    
    if ($stmt) {
        $stmt->bind_param("i", $product_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result && $result->num_rows > 0) {
            $product = $result->fetch_assoc();
            
            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "Berhasil mengambil data produk.",
                "data" => $product
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "message" => "Produk tidak ditemukan.",
                "data" => null
            ]);
        }
        $stmt->close();
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Gagal menyiapkan query database.",
            "data" => null
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "ID Produk tidak diberikan.",
        "data" => null
    ]);
}

$conn->close();
?>
