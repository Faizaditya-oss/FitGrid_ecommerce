<?php
$_POST_DATA = json_encode(['email' => 'faizaditya18@gmail.com', 'password' => 'Faizaditya123']);
// I don't know the exact password, let's just make a POST request with cURL in PHP to the local server
$ch = curl_init('http://localhost:8000/api/auth/login.php');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['email' => 'faizaditya18@gmail.com', 'password' => 'password123'])); // try a dummy pass
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
$result = curl_exec($ch);
curl_close($ch);
echo "Result: " . $result;
?>
