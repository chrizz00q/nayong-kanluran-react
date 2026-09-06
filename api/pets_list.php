<?php
// api/pets_list.php - Clean JSON list for the React frontend.
// Same filtering behaviour as pets.php (DataTables), but returns plain
// fields instead of pre-rendered HTML, so React can render its own table/actions.
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
$allowed_sorts = ['id', 'pet_name', 'pet_type', 'breed', 'status', 'created_at'];
if (!in_array($sort_column, $allowed_sorts)) {
    $sort_column = 'created_at';
}
$order_by = $sort_column === 'created_at' ? 'p.created_at' : "p.$sort_column";

$sql = "SELECT p.*,
        CONCAT(h.last_name, ', ', h.first_name,
               IF(h.middle_name IS NOT NULL, CONCAT(' ', SUBSTRING(h.middle_name, 1, 1), '.'), ''),
               IF(h.ext_name IS NOT NULL, CONCAT(' (', h.ext_name, ')'), '')) as owner_name
        FROM pets p
        LEFT JOIN household_records h ON p.owner_id = h.id
        WHERE 1=1";
$count_sql = "SELECT COUNT(*) FROM pets p LEFT JOIN household_records h ON p.owner_id = h.id WHERE 1=1";
$params = [];

if ($search !== '') {
    $sql .= " AND (p.pet_name LIKE ? OR p.pet_type LIKE ? OR p.breed LIKE ? OR h.last_name LIKE ?)";
    $count_sql .= " AND (p.pet_name LIKE ? OR p.pet_type LIKE ? OR p.breed LIKE ? OR h.last_name LIKE ?)";
    $p = "%$search%";
    array_push($params, $p, $p, $p, $p);
}

foreach (['pet_type' => 'p.pet_type', 'status' => 'p.status'] as $qs => $col) {
    if (!empty($_GET[$qs])) {
        $sql .= " AND $col = ?";
        $count_sql .= " AND $col = ?";
        $params[] = $_GET[$qs];
    }
}

$stmt = $pdo->prepare($count_sql);
$stmt->execute($params);
$total = (int)$stmt->fetchColumn();

$sql .= " ORDER BY $order_by $sort_dir LIMIT $limit OFFSET $offset";
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
