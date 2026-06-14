<?php
require 'config/database.php';
$db = new Database();
$conn = $db->getConnection();

// Ubah tipe kolom image_url dari VARCHAR(255) menjadi LONGTEXT agar dapat menyimpan Base64
$result = $conn->query("ALTER TABLE products MODIFY COLUMN image_url LONGTEXT DEFAULT NULL");

if ($result) {
    echo "Sukses! Kolom image_url berhasil diubah ke LONGTEXT.";
} else {
    echo "Gagal: " . $conn->error;
}
?>
