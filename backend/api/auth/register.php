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

// Pastikan data tidak kosong
if (
    !empty($data->username) &&
    !empty($data->email) &&
    !empty($data->password)
) {
    $username = $conn->real_escape_string($data->username);
    $email = $conn->real_escape_string($data->email);
    $password = $data->password;
    $phone_number = !empty($data->phone_number) ? $conn->real_escape_string($data->phone_number) : null;

    // Validasi panjang password
    if (strlen($password) < 6) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Password minimal 6 karakter."]);
        exit();
    }

    // Validasi email duplikat
    $check_email_query = "SELECT user_id FROM users WHERE email = '$email' LIMIT 1";
    $result = $conn->query($check_email_query);

    if ($result && $result->num_rows > 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Email sudah terdaftar."]);
        exit();
    }

    // Hash password
    $password_hash = password_hash($password, PASSWORD_BCRYPT);
    $role = 'customer';
    $status = 'Active';

    // Insert user baru
    $query = "INSERT INTO users (username, email, password_hash, phone_number, role, status) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($query);
    
    if ($stmt) {
        $stmt->bind_param("ssssss", $username, $email, $password_hash, $phone_number, $role, $status);
        
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode([
                "success" => true,
                "message" => "Registrasi berhasil."
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Terjadi kesalahan saat registrasi: " . $stmt->error
            ]);
        }
        $stmt->close();
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Database error: Gagal menyiapkan query."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Data tidak lengkap. Harap isi username, email, dan password."]);
}

$conn->close();
?>
