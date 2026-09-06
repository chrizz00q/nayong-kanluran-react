<?php
// api/pet_delete_json.php - Delete a pet record. JSON response, for the React
// frontend (unlike pet_delete.php, which redirects and is used by the legacy
// extras/pets.php page). Same convention as citizen_delete.php.
require_once '../config.php';
requireLogin();
requirePermission('extras', 'delete');

header('Content-Type: application/json');

$id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid ID']);
    exit();
}

$pdo = getDB();
$stmt = $pdo->prepare("SELECT * FROM pets WHERE id = ?");
$stmt->execute([$id]);
$pet = $stmt->fetch();

if (!$pet) {
    echo json_encode(['success' => false, 'message' => 'Pet not found']);
    exit();
}

if ($pet['pet_photo']) {
    deleteFile($pet['pet_photo']);
}

$stmt = $pdo->prepare("DELETE FROM pets WHERE id = ?");
if ($stmt->execute([$id])) {
    logAudit($_SESSION['user_id'], 'DELETE', 'pets', $id,
        "Deleted pet: " . $pet['pet_name']);
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to delete pet']);
}
