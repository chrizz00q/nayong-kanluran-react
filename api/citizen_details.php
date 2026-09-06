<?php
// api/citizen_details.php - fetch a single individual_records row.
require_once '../config.php';
requireLogin();

header('Content-Type: application/json');

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) {
    echo json_encode(['error' => 'Invalid ID']);
    exit();
}

$pdo = getDB();
$stmt = $pdo->prepare("SELECT * FROM individual_records WHERE id = ?");
$stmt->execute([$id]);
$record = $stmt->fetch();

if (!$record) {
    echo json_encode(['error' => 'Citizen not found']);
    exit();
}

echo json_encode($record);
