<?php
// api/backup_download.php - Download backup file
require_once '../config.php';
requireLogin();
requirePermission('system', 'sql_execute');

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    die('Invalid backup ID');
}

$pdo = getDB();

$stmt = $pdo->prepare("SELECT * FROM backups WHERE id = ?");
$stmt->execute([$id]);
$backup = $stmt->fetch();

if (!$backup) {
    die('Backup not found');
}

$filepath = BACKUP_DIR . $backup['filename'];

if (!file_exists($filepath)) {
    die('Backup file not found');
}

// Force download
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="' . $backup['filename'] . '"');
header('Content-Length: ' . filesize($filepath));
header('Cache-Control: private, max-age=0, must-revalidate');
header('Pragma: public');

readfile($filepath);
exit();
?>