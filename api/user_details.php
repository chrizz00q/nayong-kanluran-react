<?php
require_once '../config.php';
requireLogin();
requirePermission('system', 'view');

header('Content-Type: application/json');

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    echo json_encode(['error' => 'Invalid ID']);
    exit();
}

$pdo = getDB();

$stmt = $pdo->prepare("
    SELECT u.*, r.role_name 
    FROM users u 
    LEFT JOIN user_roles r ON u.role_id = r.id 
    WHERE u.id = ?
");
$stmt->execute([$id]);
$user = $stmt->fetch();

if (!$user) {
    echo json_encode(['error' => 'User not found']);
    exit();
}

// Remove password from response
unset($user['password']);

echo json_encode($user);
?>