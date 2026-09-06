<?php
// api/dashboard_stats.php - JSON wrapper around config.php's getDashboardStats(),
// plus the extra numbers dashboard.php computed inline (male/female split).
require_once '../config.php';
requireLogin();

header('Content-Type: application/json');

$pdo = getDB();
$stats = getDashboardStats();

$total_individuals = (int)$pdo->query("SELECT COUNT(*) FROM individual_records")->fetchColumn();

echo json_encode([
    'total_households' => (int)$stats['total_households'],
    'total_population' => (int)$stats['total_population'],
    'total_individuals' => $total_individuals,
    'total_male' => (int)$stats['total_male'],
    'total_female' => (int)$stats['total_female'],
    'birthday_today' => (int)$stats['birthday_today'],
    'birthday_celebrants' => $stats['birthday_celebrants'],
]);
