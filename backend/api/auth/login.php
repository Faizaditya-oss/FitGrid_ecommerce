<?php
// Izinkan akses dari origin manapun (CORS)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';

$database = new Database();
$conn = $database->getConnection();

// Mendapatkan data JSON dari frontend
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->password)) {
    $email = $conn->real_escape_string($data->email);
    $password = $data->password;

    $query = "SELECT user_id, username, email, password_hash, role, status, profile_picture FROM users WHERE email = ? LIMIT 1";
    $stmt = $conn->prepare($query);
    
    if ($stmt) {
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result && $result->num_rows > 0) {
            $user = $result->fetch_assoc();

            // Verifikasi password
            if (password_verify($password, $user['password_hash'])) {
                
                // Cek status user
                if ($user['status'] === 'Banned') {
                    http_response_code(403);
                    echo json_encode([
                        "success" => false, 
                        "message" => "Akun Anda telah di-banned. Silakan hubungi admin."
                    ]);
                    exit();
                }

                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "message" => "Login berhasil.",
                    "user" => [
                        "user_id" => $user['user_id'],
                        "username" => $user['username'],
                        "email" => $user['email'],
                        "role" => $user['role'],
                        "status" => $user['status'],
                        "profile_picture" => !empty($user['profile_picture']) ? "http://localhost:8000/" . $user['profile_picture'] : null
                    ]
                ]);
            } else {
                http_response_code(401);
                echo json_encode([
                    "success" => false,
                    "message" => "Email atau password salah."
                ]);
            }
        } else {
            http_response_code(401);
            echo json_encode([
                "success" => false,
                "message" => "Email atau password salah."
            ]);
        }
        $stmt->close();
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Database error: Gagal menyiapkan query."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Data tidak lengkap. Harap isi email dan password."]);
}

$conn->close();
?>
