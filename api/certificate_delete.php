<?php
// api/certificate_delete.php - Delete a certificate row (JSON response).
require_once '../config.php';
requireLogin();
requirePermission('certification', 'delete');

header('Content-Type: application/json');

$id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid ID']);
    exit();
}

$pdo = getDB();
$stmt = $pdo->prepare("SELECT * FROM certificates WHERE id = ?");
$stmt->execute([$id]);
$record = $stmt->fetch();

if (!$record) {
    echo json_encode(['success' => false, 'message' => 'Certificate not found']);
    exit();
}

$stmt = $pdo->prepare("DELETE FROM certificates WHERE id = ?");
if ($stmt->execute([$id])) {
    logAudit($_SESSION['user_id'], 'DELETE', 'certificates', $id,
        "Deleted certificate: " . $record['certificate_type'] . ' #' . $record['certificate_number']);
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to delete certificate']);
}
