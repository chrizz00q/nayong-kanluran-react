<?php
require_once '../config.php';
requireLogin();
requirePermission('system', 'manage');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
    
    if ($id <= 0) {
        header('Location: users.php?error=invalid_id');
        exit();
    }
    
    // Prevent deleting yourself
    if ($id == $_SESSION['user_id']) {
        header('Location: users.php?error=cannot_delete_self');
        exit();
    }
    
    $pdo = getDB();
    
    // Get user details for audit
    $stmt = $pdo->prepare("SELECT username, full_name FROM users WHERE id = ?");
    $stmt->execute([$id]);
    $user = $stmt->fetch();
    
    if (!$user) {
        header('Location: users.php?error=user_not_found');
        exit();
    }
    
    // Delete user
    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
    if ($stmt->execute([$id])) {
        logAudit($_SESSION['user_id'], 'DELETE', 'users', $id, "Deleted user: " . $user['username'] . " (" . $user['full_name'] . ")");
        header('Location: users.php?success=deleted');
        exit();
    } else {
        header('Location: users.php?error=delete_failed');
        exit();
    }
}

// If not POST request, redirect to users list
header('Location: users.php');
exit();
?>