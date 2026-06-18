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

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->review_id) && !empty($data->user_id)) {
    $review_id = $data->review_id;
    $user_id = $data->user_id;

    $query = "DELETE FROM reviews WHERE review_id = ? AND user_id = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("ii", $review_id, $user_id);

    if ($stmt->execute() && $stmt->affected_rows > 0) {
        echo json_encode(array("success" => true, "message" => "Review deleted successfully."));
    } else {
        echo json_encode(array("success" => false, "message" => "Unable to delete review or unauthorized."));
    }
} else {
    echo json_encode(array("success" => false, "message" => "Incomplete data."));
}
?>
