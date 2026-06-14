<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'config/Database.php';

$database = new Database();
$conn = $database->getConnection();

if ($conn) {
    echo json_encode([
        "success" => true,
        "message" => "Koneksi database ke 'fashion_store' berhasil!"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Koneksi database gagal."
    ]);
}
?>
