<?php
// api/reports_household.php - JSON data for the React Household Report page,
// mirroring the query in reports/household.php.
require_once '../config.php';
requireLogin();

header('Content-Type: application/json');

$pdo = getDB();

$households = $pdo->query("
    SELECT h.*,
           (SELECT COUNT(*) FROM individual_records WHERE last_name = h.last_name AND first_name != h.first_name) as member_count
    FROM household_records h
    ORDER BY h.last_name, h.first_name
")->fetchAll();

echo json_encode([
    'total_households' => count($households),
    'data' => $households,
]);
