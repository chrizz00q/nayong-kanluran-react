<?php
// api/pet_stats.php - Get pet statistics
require_once '../config.php';
requireLogin();

header('Content-Type: application/json');

$pdo = getDB();

$total = $pdo->query("SELECT COUNT(*) FROM pets")->fetchColumn();
$active = $pdo->query("SELECT COUNT(*) FROM pets WHERE status = 'Active'")->fetchColumn();
$inactive = $pdo->query("SELECT COUNT(*) FROM pets WHERE status = 'Inactive'")->fetchColumn();
$deceased = $pdo->query("SELECT COUNT(*) FROM pets WHERE status = 'Deceased'")->fetchColumn();

echo json_encode([
    'total' => (int)$total,
    'active' => (int)$active,
    'inactive' => (int)$inactive,
    'deceased' => (int)$deceased
]);
?>