<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

if (isset($_POST['user_id']) && isset($_FILES['avatar'])) {
    $user_id = $_POST['user_id'];
    $file = $_FILES['avatar'];

    $allowed_extensions = ['jpg', 'jpeg', 'png'];
    $max_size = 2 * 1024 * 1024; // 2 MB

    $filename = $file['name'];
    $file_tmp = $file['tmp_name'];
    $file_size = $file['size'];
    $file_error = $file['error'];

    $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

    if (!in_array($ext, $allowed_extensions)) {
        echo json_encode(["success" => false, "message" => "Invalid file format. Only JPG, JPEG, PNG are allowed."]);
        exit();
    }

    if ($file_size > $max_size) {
        echo json_encode(["success" => false, "message" => "File size exceeds 2MB limit."]);
        exit();
    }

    if ($file_error !== 0) {
        echo json_encode(["success" => false, "message" => "Error uploading file."]);
        exit();
    }

    $new_filename = uniqid('avatar_', true) . '.' . $ext;
    $upload_dir = '../../uploads/profiles/';
    
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    $destination = $upload_dir . $new_filename;
    
    // Relative path to store in db so frontend can access via localhost:8000/uploads/profiles/
    $db_path = 'uploads/profiles/' . $new_filename; 

    if (move_uploaded_file($file_tmp, $destination)) {
        $query = "UPDATE users SET profile_picture = ? WHERE user_id = ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("si", $db_path, $user_id);
        
        if ($stmt->execute()) {
            echo json_encode([
                "success" => true, 
                "message" => "Avatar uploaded successfully",
                "profile_picture" => "http://localhost:8000/" . $db_path
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Database update failed"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Failed to move uploaded file"]);
    }

} else {
    echo json_encode(["success" => false, "message" => "Missing user_id or avatar file"]);
}
?>
