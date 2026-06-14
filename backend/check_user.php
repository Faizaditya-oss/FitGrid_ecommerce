<?php
require 'config/database.php';
$db = new Database();
$conn = $db->getConnection();
$res = $conn->query("SELECT * FROM users WHERE email='faizaditya18@gmail.com'");
$user = $res->fetch_assoc();
print_r($user);
?>
