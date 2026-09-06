<?php
// api/citizens_search.php - Lightweight searchable resident picker for the
// certification module (individual_records), analogous to api/owners.php
// which does the same thing for household_records.
require_once '../config.php';
requireLogin();

header('Content-Type: application/json');

$pdo = getDB();

$search = isset($_GET['search']) ? trim($_GET['search']) : '';

$sql = "SELECT id, last_name, first_name, middle_name, ext_name
        FROM individual_records
        WHERE 1=1";
$params = [];

if (!empty($search)) {
    $sql .= " AND (last_name LIKE ? OR first_name LIKE ?)";
    $p = "%$search%";
    $params[] = $p;
    $params[] = $p;
}

$sql .= " ORDER BY last_name, first_name LIMIT 50";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$residents = $stmt->fetchAll();

echo json_encode([
    'data' => $residents,
    'total' => count($residents),
    'search' => $search,
]);
