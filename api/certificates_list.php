<?php
// api/certificates_list.php - Clean JSON list for certificates (React frontend).
require_once '../config.php';
requireLogin();

header('Content-Type: application/json');

$pdo = getDB();

$page = max(1, (int)($_GET['page'] ?? 1));
$limit = min(100, max(1, (int)($_GET['limit'] ?? 10)));
$offset = ($page - 1) * $limit;
$search = trim($_GET['search'] ?? '');

$sort_column = $_GET['sort'] ?? 'c.created_at';
$sort_dir = strtoupper($_GET['dir'] ?? 'DESC') === 'ASC' ? 'ASC' : 'DESC';
$allowed_sorts = ['c.id', 'c.certificate_number', 'c.certificate_type', 'c.status', 'c.issued_date', 'c.created_at'];
if (!in_array($sort_column, $allowed_sorts)) {
    $sort_column = 'c.created_at';
}

$sql = "SELECT c.id, c.resident_id, c.certificate_type, c.certificate_number, c.purpose, c.issued_date,
               c.expiry_date, c.status, c.created_at,
               i.last_name, i.first_name, i.middle_name, i.ext_name
        FROM certificates c
        LEFT JOIN individual_records i ON c.resident_id = i.id
        WHERE 1=1";
$count_sql = "SELECT COUNT(*) FROM certificates c LEFT JOIN individual_records i ON c.resident_id = i.id WHERE 1=1";
$params = [];

if ($search !== '') {
    $sql .= " AND (i.last_name LIKE ? OR i.first_name LIKE ? OR c.certificate_type LIKE ? OR c.certificate_number LIKE ?)";
    $count_sql .= " AND (i.last_name LIKE ? OR i.first_name LIKE ? OR c.certificate_type LIKE ? OR c.certificate_number LIKE ?)";
    $p = "%$search%";
    array_push($params, $p, $p, $p, $p);
}

if (!empty($_GET['certificate_type'])) {
    $sql .= " AND c.certificate_type = ?";
    $count_sql .= " AND c.certificate_type = ?";
    $params[] = $_GET['certificate_type'];
}

if (!empty($_GET['status'])) {
    $sql .= " AND c.status = ?";
    $count_sql .= " AND c.status = ?";
    $params[] = $_GET['status'];
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
