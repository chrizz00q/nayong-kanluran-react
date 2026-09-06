<?php
// api/citizen_delete.php - Delete an individual_records row. JSON response
// (unlike the legacy inhabitants/citizens/delete.php which redirects).
require_once '../config.php';
requireLogin();
requirePermission('inhabitants', 'delete');

header('Content-Type: application/json');

$id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid ID']);
    exit();
}

$pdo = getDB();
$stmt = $pdo->prepare("SELECT * FROM individual_records WHERE id = ?");
$stmt->execute([$id]);
$record = $stmt->fetch();

if (!$record) {
    echo json_encode(['success' => false, 'message' => 'Citizen not found']);
    exit();
}

if ($record['profile_picture']) {
    deleteFile($record['profile_picture']);
}

$stmt = $pdo->prepare("DELETE FROM individual_records WHERE id = ?");
if ($stmt->execute([$id])) {
    logAudit($_SESSION['user_id'], 'DELETE', 'individual_records', $id,
        "Deleted citizen: " . $record['last_name'] . ', ' . $record['first_name']);
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to delete citizen']);
}
