<?php
// api/households_demographics.php - Stats for the Households Demographic page,
// mirroring the queries in the original households.php.
require_once '../config.php';
requireLogin();

header('Content-Type: application/json');

$pdo = getDB();

$total_households = (int)$pdo->query("SELECT COUNT(*) FROM household_records")->fetchColumn();

$dwelling_stats = $pdo->query("
    SELECT dwelling_type, COUNT(*) as count
    FROM household_records
    WHERE dwelling_type IS NOT NULL AND dwelling_type != ''
    GROUP BY dwelling_type
    ORDER BY count DESC
")->fetchAll();

$type_stats = $pdo->query("
    SELECT household_type, COUNT(*) as count
    FROM household_records
    WHERE household_type IS NOT NULL AND household_type != ''
    GROUP BY household_type
    ORDER BY count DESC
")->fetchAll();

$tenure_stats = $pdo->query("
    SELECT tenure_status, COUNT(*) as count
    FROM household_records
    WHERE tenure_status IS NOT NULL AND tenure_status != ''
    GROUP BY tenure_status
    ORDER BY count DESC
")->fetchAll();

echo json_encode([
    'total_households' => $total_households,
    'dwelling_stats' => $dwelling_stats,
    'type_stats' => $type_stats,
    'tenure_stats' => $tenure_stats,
]);
