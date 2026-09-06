<?php
// api/reports_voters.php - JSON data for the React Voters List page,
// mirroring the query in reports/voters_list.php.
require_once '../config.php';
requireLogin();

header('Content-Type: application/json');

$pdo = getDB();

$voters = $pdo->query("
    SELECT * FROM individual_records
    WHERE age >= 18 AND age IS NOT NULL
    ORDER BY last_name, first_name
")->fetchAll();

echo json_encode([
    'total_voters' => count($voters),
    'data' => $voters,
]);
