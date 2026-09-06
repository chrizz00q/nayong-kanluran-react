<?php
require_once '../../config.php';
requireLogin();
requirePermission('system', 'sql_execute');

$pdo = getDB();
$success = '';
$error = '';

// Create backup directory if not exists
$backup_dir = BACKUP_DIR;
if (!file_exists($backup_dir)) {
    mkdir($backup_dir, 0777, true);
}

// Handle backup creation
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'create_backup') {
        $description = isset($_POST['description']) ? trim($_POST['description']) : 'Manual backup';
        
        // Generate backup filename
        $filename = 'rbis_backup_' . date('Y-m-d_H-i-s') . '.sql';
        $filepath = $backup_dir . $filename;
        
        // Get all tables
        $tables = [];
        $stmt = $pdo->query("SHOW TABLES");
        while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
            $tables[] = $row[0];
        }
        
        // Generate SQL dump
        $sql_content = "-- RBIS Database Backup\n";
        $sql_content .= "-- Generated: " . date('Y-m-d H:i:s') . "\n";
        $sql_content .= "-- Tables: " . implode(', ', $tables) . "\n\n";
        $sql_content .= "SET FOREIGN_KEY_CHECKS=0;\n\n";
        
        foreach ($tables as $table) {
            // Get create table statement
            $stmt = $pdo->query("SHOW CREATE TABLE $table");
            $create = $stmt->fetch(PDO::FETCH_ASSOC);
            $sql_content .= "DROP TABLE IF EXISTS `$table`;\n";
            $sql_content .= $create['Create Table'] . ";\n\n";
            
            // Get data
            $data_stmt = $pdo->query("SELECT * FROM $table");
            $rows = $data_stmt->fetchAll();
            
            if (count($rows) > 0) {
                $columns = array_keys($rows[0]);
                $column_names = implode('`, `', $columns);
                
                foreach ($rows as $row) {
                    $values = [];
                    foreach ($row as $value) {
                        if ($value === null) {
                            $values[] = 'NULL';
                        } else {
                            $values[] = $pdo->quote($value);
                        }
                    }
                    $sql_content .= "INSERT INTO `$table` (`$column_names`) VALUES (" . implode(', ', $values) . ");\n";
                }
                $sql_content .= "\n";
            }
        }
        
        $sql_content .= "SET FOREIGN_KEY_CHECKS=1;\n";
        
        // Save file
        if (file_put_contents($filepath, $sql_content)) {
            $file_size = filesize($filepath);
            
            // Log backup
            $stmt = $pdo->prepare("INSERT INTO backups (filename, file_size, description, created_by) VALUES (?, ?, ?, ?)");
            $stmt->execute([$filename, $file_size, $description, $_SESSION['user_id']]);
            
            logAudit($_SESSION['user_id'], 'BACKUP', 'database', null, "Created backup: $filename");
            $success = "Backup created successfully! File: $filename (" . formatFileSize($file_size) . ")";
        } else {
            $error = "Failed to create backup. Please check directory permissions.";
        }
    }
    
    // Handle restore
    if ($_POST['action'] === 'restore_backup' && isset($_POST['backup_id'])) {
        $backup_id = (int)$_POST['backup_id'];
        
        $stmt = $pdo->prepare("SELECT * FROM backups WHERE id = ?");
        $stmt->execute([$backup_id]);
        $backup = $stmt->fetch();
        
        if ($backup) {
            $filepath = $backup_dir . $backup['filename'];
            if (file_exists($filepath)) {
                $sql_content = file_get_contents($filepath);
                
                try {
                    $pdo->exec($sql_content);
                    logAudit($_SESSION['user_id'], 'RESTORE', 'database', null, "Restored backup: " . $backup['filename']);
                    $success = "Database restored successfully from: " . $backup['filename'];
                } catch (PDOException $e) {
                    $error = "Restore failed: " . $e->getMessage();
                }
            } else {
                $error = "Backup file not found.";
            }
        } else {
            $error = "Backup record not found.";
        }
    }
    
    // Handle delete backup
    if ($_POST['action'] === 'delete_backup' && isset($_POST['backup_id'])) {
        $backup_id = (int)$_POST['backup_id'];
        
        $stmt = $pdo->prepare("SELECT * FROM backups WHERE id = ?");
        $stmt->execute([$backup_id]);
        $backup = $stmt->fetch();
        
        if ($backup) {
            $filepath = $backup_dir . $backup['filename'];
            if (file_exists($filepath)) {
                unlink($filepath);
            }
            
            $stmt = $pdo->prepare("DELETE FROM backups WHERE id = ?");
            $stmt->execute([$backup_id]);
            
            logAudit($_SESSION['user_id'], 'DELETE_BACKUP', 'database', null, "Deleted backup: " . $backup['filename']);
            $success = "Backup deleted successfully.";
        } else {
            $error = "Backup record not found.";
        }
    }
}

// Get backup list
$backups = $pdo->query("
    SELECT b.*, u.full_name as created_by_name 
    FROM backups b 
    LEFT JOIN users u ON b.created_by = u.id 
    ORDER BY b.created_at DESC
")->fetchAll();

function formatFileSize($bytes) {
    if ($bytes >= 1073741824) {
        return number_format($bytes / 1073741824, 2) . ' GB';
    } elseif ($bytes >= 1048576) {
        return number_format($bytes / 1048576, 2) . ' MB';
    } elseif ($bytes >= 1024) {
        return number_format($bytes / 1024, 2) . ' KB';
    } else {
        return $bytes . ' B';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Backup Database - RBIS</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="../../assets/css/custom.css">
    <style>
        .backup-card {
            border-radius: 15px;
            transition: transform 0.3s;
            height: 100%;
        }
        .backup-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 20px rgba(0,0,0,0.08);
        }
        .stat-card {
            border-radius: 15px;
            padding: 20px;
            transition: transform 0.3s;
            cursor: default;
        }
        .stat-card:hover {
            transform: translateY(-3px);
        }
        .stat-number {
            font-size: 2rem;
            font-weight: 700;
        }
        .stat-label {
            font-size: 0.85rem;
            opacity: 0.8;
        }
        .stat-icon {
            font-size: 2rem;
            opacity: 0.3;
        }
        .file-size-badge {
            font-size: 0.7rem;
            padding: 3px 10px;
        }
    </style>
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <?php include '../../includes/sidebar.php'; ?>
            
            <main class="col-md-10 ms-sm-auto px-md-4 main-content">
                <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 class="h2">
                        <i class="fas fa-database text-danger"></i> Database Backup
                        <span class="badge bg-danger ms-2"><?= count($backups) ?> Backups</span>
                    </h1>
                    <a href="index.php" class="btn btn-secondary">
                        <i class="fas fa-arrow-left"></i> Back to Database
                    </a>
                </div>

                <?php if ($success): ?>
                    <div class="alert alert-success alert-dismissible fade show">
                        <i class="fas fa-check-circle"></i> <?= $success ?>
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                <?php endif; ?>

                <?php if ($error): ?>
                    <div class="alert alert-danger alert-dismissible fade show">
                        <i class="fas fa-exclamation-circle"></i> <?= $error ?>
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                <?php endif; ?>

                <!-- Statistics -->
                <div class="row mb-4">
                    <div class="col-md-3">
                        <div class="stat-card bg-primary text-white">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <div class="stat-number"><?= count($backups) ?></div>
                                    <div class="stat-label">Total Backups</div>
                                </div>
                                <div class="stat-icon">
                                    <i class="fas fa-database"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-card bg-success text-white">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <div class="stat-number">
                                        <?php 
                                        $total_size = array_sum(array_column($backups, 'file_size'));
                                        echo formatFileSize($total_size);
                                        ?>
                                    </div>
                                    <div class="stat-label">Total Size</div>
                                </div>
                                <div class="stat-icon">
                                    <i class="fas fa-hdd"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-card bg-info text-white">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <div class="stat-number">
                                        <?php 
                                        $today = date('Y-m-d');
                                        $today_backups = array_filter($backups, function($b) use ($today) {
                                            return date('Y-m-d', strtotime($b['created_at'])) == $today;
                                        });
                                        echo count($today_backups);
                                        ?>
                                    </div>
                                    <div class="stat-label">Today's Backups</div>
                                </div>
                                <div class="stat-icon">
                                    <i class="fas fa-calendar-day"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-card bg-warning text-white">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <div class="stat-number">
                                        <?php 
                                        $week_ago = date('Y-m-d', strtotime('-7 days'));
                                        $recent_backups = array_filter($backups, function($b) use ($week_ago) {
                                            return date('Y-m-d', strtotime($b['created_at'])) >= $week_ago;
                                        });
                                        echo count($recent_backups);
                                        ?>
                                    </div>
                                    <div class="stat-label">Last 7 Days</div>
                                </div>
                                <div class="stat-icon">
                                    <i class="fas fa-calendar-week"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Create Backup -->
                <div class="card mb-4">
                    <div class="card-header bg-white">
                        <h5 class="mb-0"><i class="fas fa-plus-circle text-success"></i> Create New Backup</h5>
                    </div>
                    <div class="card-body">
                        <form method="POST" class="row g-3">
                            <input type="hidden" name="action" value="create_backup">
                            <div class="col-md-8">
                                <label class="form-label">Description</label>
                                <input type="text" name="description" class="form-control" placeholder="e.g., Weekly backup, Before update, etc.">
                            </div>
                            <div class="col-md-4 d-flex align-items-end">
                                <button type="submit" class="btn btn-success w-100">
                                    <i class="fas fa-database"></i> Create Backup
                                </button>
                            </div>
                        </form>
                        <div class="mt-2">
                            <small class="text-muted">
                                <i class="fas fa-info-circle"></i> 
                                Backup includes all tables with full data. Files are stored in: <code><?= BACKUP_DIR ?></code>
                            </small>
                        </div>
                    </div>
                </div>

                <!-- Backup List -->
                <div class="card">
                    <div class="card-header bg-white">
                        <h5 class="mb-0"><i class="fas fa-list text-primary"></i> Backup History</h5>
                    </div>
                    <div class="card-body">
                        <?php if (count($backups) > 0): ?>
                            <div class="table-responsive">
                                <table class="table table-hover table-striped">
                                    <thead class="table-dark">
                                        <tr>
                                            <th>#</th>
                                            <th>Filename</th>
                                            <th>Description</th>
                                            <th>Size</th>
                                            <th>Created By</th>
                                            <th>Date/Time</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach ($backups as $index => $backup): ?>
                                            <tr>
                                                <td><?= $index + 1 ?></td>
                                                <td>
                                                    <code><?= htmlspecialchars($backup['filename']) ?></code>
                                                </td>
                                                <td><?= htmlspecialchars($backup['description'] ?? 'No description') ?></td>
                                                <td>
                                                    <span class="badge bg-secondary file-size-badge">
                                                        <?= formatFileSize($backup['file_size']) ?>
                                                    </span>
                                                </td>
                                                <td><?= htmlspecialchars($backup['created_by_name'] ?? 'System') ?></td>
                                                <td><?= date('M d, Y h:i A', strtotime($backup['created_at'])) ?></td>
                                                <td>
                                                    <div class="btn-group btn-group-sm">
                                                        <a href="../../api/backup_download.php?id=<?= $backup['id'] ?>" class="btn btn-info" title="Download">
                                                            <i class="fas fa-download"></i>
                                                        </a>
                                                        <form method="POST" style="display: inline;" onsubmit="return confirm('Are you sure you want to restore this backup? This will overwrite the current database!')">
                                                            <input type="hidden" name="action" value="restore_backup">
                                                            <input type="hidden" name="backup_id" value="<?= $backup['id'] ?>">
                                                            <button type="submit" class="btn btn-warning" title="Restore">
                                                                <i class="fas fa-undo"></i>
                                                            </button>
                                                        </form>
                                                        <form method="POST" style="display: inline;" onsubmit="return confirm('Are you sure you want to delete this backup?')">
                                                            <input type="hidden" name="action" value="delete_backup">
                                                            <input type="hidden" name="backup_id" value="<?= $backup['id'] ?>">
                                                            <button type="submit" class="btn btn-danger" title="Delete">
                                                                <i class="fas fa-trash"></i>
                                                            </button>
                                                        </form>
                                                    </div>
                                                </td>
                                            </tr>
                                        <?php endforeach; ?>
                                    </tbody>
                                </table>
                            </div>
                        <?php else: ?>
                            <div class="text-center py-4">
                                <i class="fas fa-database fa-3x text-muted"></i>
                                <p class="mt-2">No backups found. Click "Create Backup" to make your first backup.</p>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>

                <!-- Backup Tips -->
                <div class="card mt-4">
                    <div class="card-header bg-white">
                        <h5 class="mb-0"><i class="fas fa-lightbulb text-warning"></i> Backup Tips</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="text-center">
                                    <i class="fas fa-clock fa-2x text-primary"></i>
                                    <h6>Regular Backups</h6>
                                    <p class="small text-muted">Create backups weekly or before making major changes to your system.</p>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="text-center">
                                    <i class="fas fa-download fa-2x text-success"></i>
                                    <h6>Download & Store</h6>
                                    <p class="small text-muted">Download important backups to keep a copy outside your server.</p>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="text-center">
                                    <i class="fas fa-trash-alt fa-2x text-danger"></i>
                                    <h6>Clean Up Old Backups</h6>
                                    <p class="small text-muted">Delete old backups to save storage space on your server.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>