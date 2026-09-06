<?php
// api/households_list.php - Clean JSON list for household_records (React frontend).
require_once '../config.php';
requireLogin();

header('Content-Type: application/json');

$pdo = getDB();

$page = max(1, (int)($_GET['page'] ?? 1));
$limit = min(100, max(1, (int)($_GET['limit'] ?? 10)));
$offset = ($page - 1) * $limit;
$search = trim($_GET['search'] ?? '');

$sort_column = $_GET['sort'] ?? 'created_at';
$sort_dir = strtoupper($_GET['dir'] ?? 'DESC') === 'ASC' ? 'ASC' : 'DESC';
$allowed_sorts = ['id', 'last_name', 'first_name', 'age', 'sex', 'civil_status', 'citizenship', 'occupation', 'created_at'];
if (!in_array($sort_column, $allowed_sorts)) {
    $sort_column = 'created_at';
}

$sql = "SELECT id, last_name, first_name, middle_name, ext_name, age, sex, civil_status,
               citizenship, occupation, household_name, household_type, profile_picture, created_at
        FROM household_records WHERE 1=1";
$count_sql = "SELECT COUNT(*) FROM household_records WHERE 1=1";
$params = [];

if ($search !== '') {
    $sql .= " AND (last_name LIKE ? OR first_name LIKE ? OR middle_name LIKE ? OR household_name LIKE ?)";
    $count_sql .= " AND (last_name LIKE ? OR first_name LIKE ? OR middle_name LIKE ? OR household_name LIKE ?)";
    $p = "%$search%";
    array_push($params, $p, $p, $p, $p);
}

foreach (['sex' => 'sex', 'civil_status' => 'civil_status'] as $qs => $col) {
    if (!empty($_GET[$qs])) {
        $sql .= " AND $col = ?";
        $count_sql .= " AND $col = ?";
        $params[] = $_GET[$qs];
    }
}

$stmt = $pdo->prepare($count_sql);
$stmt->execute($params);
$total = (int)$stmt->fetchColumn();

$sql .= " ORDER BY $sort_column $sort_dir LIMIT $limit OFFSET $offset";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$records = $stmt->fetchAll();

echo json_encode([
    'data' => $records,
    'total' => $total,
    'page' => $page,
    'limit' => $limit,
    'totalPages' => (int)ceil($total / $limit),
]);
