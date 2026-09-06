<?php
// api/household_details.php - fetch a single household_records row.
require_once '../config.php';
requireLogin();

header('Content-Type: application/json');

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) {
    echo json_encode(['error' => 'Invalid ID']);
    exit();
}

$pdo = getDB();
$stmt = $pdo->prepare("SELECT * FROM household_records WHERE id = ?");
$stmt->execute([$id]);
$record = $stmt->fetch();

if (!$record) {
    echo json_encode(['error' => 'Household record not found']);
    exit();
}

echo json_encode($record);
