<?php
// api/recent_activities.php - Recent audit trail entries for the dashboard feed.
require_once '../config.php';
requireLogin();

header('Content-Type: application/json');

$pdo = getDB();
$limit = min(50, max(1, (int)($_GET['limit'] ?? 10)));

$stmt = $pdo->prepare("
    SELECT a.id, a.action, a.table_name, a.record_id, a.details, a.created_at, u.full_name
    FROM audit_trails a
    LEFT JOIN users u ON a.user_id = u.id
    ORDER BY a.created_at DESC
    LIMIT $limit
");
$stmt->execute();

echo json_encode(['data' => $stmt->fetchAll()]);
