<?php
// api/pet_update.php - Update pet record
require_once '../config.php';
requireLogin();
requirePermission('extras', 'edit');

header('Content-Type: application/json');

$pdo = getDB();

$id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
$owner_id = isset($_POST['owner_id']) ? (int)$_POST['owner_id'] : 0;
$pet_name = isset($_POST['pet_name']) ? trim($_POST['pet_name']) : '';
$pet_type = isset($_POST['pet_type']) ? trim($_POST['pet_type']) : '';
$breed = isset($_POST['breed']) ? trim($_POST['breed']) : '';
$color = isset($_POST['color']) ? trim($_POST['color']) : '';
$gender = isset($_POST['gender']) ? trim($_POST['gender']) : 'Male';
$weight = isset($_POST['weight']) && $_POST['weight'] !== '' ? (float)$_POST['weight'] : null;
$microchip_number = isset($_POST['microchip_number']) ? trim($_POST['microchip_number']) : '';
$vaccination_status = isset($_POST['vaccination_status']) ? trim($_POST['vaccination_status']) : 'None';
$registration_date = isset($_POST['registration_date']) ? $_POST['registration_date'] : null;
$status = isset($_POST['status']) ? trim($_POST['status']) : 'Active';

// Validate
if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid pet ID']);
    exit();
}

if (empty($pet_name)) {
    echo json_encode(['success' => false, 'message' => 'Pet name is required']);
    exit();
}

if (empty($pet_type)) {
    echo json_encode(['success' => false, 'message' => 'Pet type is required']);
    exit();
}

if ($owner_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Please select an owner']);
    exit();
}

// Get current pet to check existing photo
$stmt = $pdo->prepare("SELECT pet_photo FROM pets WHERE id = ?");
$stmt->execute([$id]);
$current = $stmt->fetch();

if (!$current) {
    echo json_encode(['success' => false, 'message' => 'Pet not found']);
    exit();
}

$pet_photo = $current['pet_photo'];

// Handle photo upload
if (isset($_FILES['pet_photo']) && $_FILES['pet_photo']['error'] !== UPLOAD_ERR_NO_FILE) {
    // Delete old photo
    if ($current['pet_photo']) {
        $old_file = UPLOAD_DIR . $current['pet_photo'];
        if (file_exists($old_file)) {
            unlink($old_file);
        }
    }
    
    // Upload new photo
    $upload_result = uploadFile($_FILES['pet_photo']);
    if ($upload_result) {
        $pet_photo = $upload_result;
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid file format. Only JPG, PNG, GIF allowed (max 2MB).']);
        exit();
    }
}

// Update pet
$sql = "UPDATE pets SET 
    owner_id = ?, pet_name = ?, pet_type = ?, breed = ?, color = ?,
    gender = ?, weight = ?, microchip_number = ?,
    vaccination_status = ?, registration_date = ?, status = ?, pet_photo = ?
    WHERE id = ?";

$stmt = $pdo->prepare($sql);
$result = $stmt->execute([
    $owner_id, $pet_name, $pet_type, $breed, $color,
    $gender, $weight, $microchip_number,
    $vaccination_status, $registration_date, $status, $pet_photo, $id
]);

if ($result) {
    logAudit($_SESSION['user_id'], 'UPDATE', 'pets', $id, 
        "Updated pet: $pet_name ($pet_type)");
    
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update pet']);
}
?>