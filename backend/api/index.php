<?php
require_once '../utils/cors.php';

// Setup CORS headers for the frontend to communicate with this API
setCorsHeaders();

// Set default Content-Type to JSON
header("Content-Type: application/json; charset=UTF-8");

// Simple routing mechanism
$request_uri = explode('?', $_SERVER['REQUEST_URI'], 2);
$route = $request_uri[0];

// Handle routes
switch ($route) {
    case '/api/products':
        // Example logic for GET /api/products
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            echo json_encode([
                "message" => "Welcome to the Fashion E-Commerce API",
                "status" => "success",
                "data" => [
                    ["id" => 1, "name" => "Modern Essential Tee", "price" => 29.00],
                    ["id" => 2, "name" => "Classic Denim Jacket", "price" => 89.00]
                ]
            ]);
        }
        break;
        
    case '/api/login':
        // Example logic for POST /api/login
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents("php://input"));
            echo json_encode([
                "status" => "success",
                "message" => "Login successful (dummy)",
                "token" => "sample_jwt_token_123"
            ]);
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(["message" => "Endpoint not found", "route" => $route]);
        break;
}
?>
