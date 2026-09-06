<?php
require_once '../config.php';
requireLogin();
requirePermission('system', 'sql_execute');

$pdo = getDB();

// Get search parameter
$search = isset($_GET['search']) ? trim($_GET['search']) : '';

// Get entries per page
$per_page = isset($_GET['per_page']) ? (int)$_GET['per_page'] : 25;
$per_page_options = [10, 25, 50, 100, 9999]; // 9999 = All

// Simple pagination
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = $per_page;
$offset = ($page - 1) * $limit;

// Get filter options
$actions = $pdo->query("SELECT DISTINCT action FROM audit_trails ORDER BY action")->fetchAll();
$modules = $pdo->query("SELECT DISTINCT table_name FROM audit_trails ORDER BY table_name")->fetchAll();
$users = $pdo->query("SELECT id, full_name FROM users ORDER BY full_name")->fetchAll();

// Build query with filters
$sql = "SELECT a.*, u.full_name, u.username 
        FROM audit_trails a 
        LEFT JOIN users u ON a.user_id = u.id 
        WHERE 1=1";
$count_sql = "SELECT COUNT(*) FROM audit_trails a WHERE 1=1";
$params = [];

if (!empty($search)) {
    $sql .= " AND (a.action LIKE ? OR a.table_name LIKE ? OR a.details LIKE ? OR u.full_name LIKE ?)";
    $search_param = "%$search%";
    $params[] = $search_param;
    $params[] = $search_param;
    $params[] = $search_param;
    $params[] = $search_param;
    $count_sql .= " AND (a.action LIKE ? OR a.table_name LIKE ? OR a.details LIKE ? OR u.full_name LIKE ?)";
}

if (isset($_GET['action']) && !empty($_GET['action'])) {
    $sql .= " AND a.action = ?";
    $count_sql .= " AND a.action = ?";
    $params[] = $_GET['action'];
}

if (isset($_GET['module']) && !empty($_GET['module'])) {
    $sql .= " AND a.table_name = ?";
    $count_sql .= " AND a.table_name = ?";
    $params[] = $_GET['module'];
}

if (isset($_GET['user']) && !empty($_GET['user'])) {
    $sql .= " AND a.user_id = ?";
    $count_sql .= " AND a.user_id = ?";
    $params[] = $_GET['user'];
}

if (isset($_GET['date_from']) && !empty($_GET['date_from'])) {
    $sql .= " AND DATE(a.created_at) >= ?";
    $count_sql .= " AND DATE(a.created_at) >= ?";
    $params[] = $_GET['date_from'];
}

if (isset($_GET['date_to']) && !empty($_GET['date_to'])) {
    $sql .= " AND DATE(a.created_at) <= ?";
    $count_sql .= " AND DATE(a.created_at) <= ?";
    $params[] = $_GET['date_to'];
}

// Get total count
$stmt = $pdo->prepare($count_sql);
$stmt->execute($params);
$total = $stmt->fetchColumn();

// Get records
$sql .= " ORDER BY a.created_at DESC LIMIT $limit OFFSET $offset";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$audits = $stmt->fetchAll();

$total_pages = ceil($total / $limit);
if ($per_page == 9999) {
    $total_pages = 1;
}

// Calculate showing range
$start = ($total > 0) ? ($offset + 1) : 0;
$end = min($offset + count($audits), $total);

$user_role = $_SESSION['role'] ?? 'enumerator';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Audit Trails - RBIS</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/dataTables.bootstrap5.min.css">
    <link rel="stylesheet" href="../assets/css/custom.css">
    <style>
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
        .filter-section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 20px;
        }
        .search-bar {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
        }
        .refresh-btn {
            border-radius: 10px;
            padding: 8px 20px;
        }
        .search-result {
            padding: 8px 15px;
            background: #e9ecef;
            border-radius: 20px;
            font-size: 0.9rem;
        }
        .search-result .highlight {
            color: #0d6efd;
            font-weight: 600;
        }
        .table th {
            white-space: nowrap;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .table td {
            font-size: 0.8rem;
        }
        .pagination-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 15px;
        }
        .pagination-container .pagination {
            margin: 0;
        }
        .per-page-selector {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .per-page-selector label {
            margin: 0;
            font-weight: 600;
            font-size: 0.85rem;
            color: #495057;
        }
        .per-page-selector select {
            border-radius: 8px;
            padding: 5px 10px;
            border: 2px solid #e8ecf1;
            background: white;
            font-size: 0.85rem;
            cursor: pointer;
        }
        .per-page-selector select:focus {
            border-color: #667eea;
            outline: none;
            box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
        .entries-info {
            color: #6c757d;
            font-size: 0.9rem;
        }
        .entries-info strong {
            color: #2d3436;
        }
        @media (max-width: 768px) {
            .pagination-container {
                flex-direction: column;
                align-items: center;
            }
            .entries-info {
                text-align: center;
            }
            .per-page-selector {
                margin-bottom: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <?php include '../includes/sidebar.php'; ?>
            
            <main class="col-md-10 ms-sm-auto px-md-4 main-content">
                <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 class="h2">
                        <i class="fas fa-clipboard-list text-warning"></i> Audit Trails
                        <span class="badge bg-warning ms-2"><?= number_format($total) ?></span>
                        <?php if (!empty($search)): ?>
                            <span class="search-result">
                                <i class="fas fa-search"></i> 
                                Showing results for: <span class="highlight">"<?= htmlspecialchars($search) ?>"</span>
                                <a href="?<?= isset($_GET['page']) ? 'page='.$_GET['page'] : '' ?><?= isset($_GET['per_page']) ? '&per_page='.$_GET['per_page'] : '' ?>" class="text-danger ms-2" title="Clear search">
                                    <i class="fas fa-times-circle"></i>
                                </a>
                            </span>
                        <?php endif; ?>
                    </h1>
                    <div class="btn-toolbar">
                        <button class="btn btn-secondary me-2 refresh-btn" onclick="window.location.reload()" title="Refresh page">
                            <i class="fas fa-sync"></i> Refresh
                        </button>
                    </div>
                </div>

                <!-- Statistics -->
                <div class="row mb-4">
                    <div class="col-md-3">
                        <div class="stat-card bg-primary text-white">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <div class="stat-number" id="totalLogs"><?= number_format($total) ?></div>
                                    <div class="stat-label">Total Activities</div>
                                </div>
                                <div class="stat-icon">
                                    <i class="fas fa-clipboard-list"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-card bg-success text-white">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <div class="stat-number" id="todayLogs">
                                        <?= $pdo->query("SELECT COUNT(*) FROM audit_trails WHERE DATE(created_at) = CURDATE()")->fetchColumn() ?>
                                    </div>
                                    <div class="stat-label">Today</div>
                                </div>
                                <div class="stat-icon">
                                    <i class="fas fa-calendar-day"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-card bg-info text-white">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <div class="stat-number" id="weekLogs">
                                        <?= $pdo->query("SELECT COUNT(*) FROM audit_trails WHERE YEARWEEK(created_at) = YEARWEEK(CURDATE())")->fetchColumn() ?>
                                    </div>
                                    <div class="stat-label">This Week</div>
                                </div>
                                <div class="stat-icon">
                                    <i class="fas fa-calendar-week"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-card bg-warning text-white">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <div class="stat-number" id="modulesCount">
                                        <?= $pdo->query("SELECT COUNT(DISTINCT table_name) FROM audit_trails")->fetchColumn() ?>
                                    </div>
                                    <div class="stat-label">Modules</div>
                                </div>
                                <div class="stat-icon">
                                    <i class="fas fa-cubes"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Filter Section -->
                <div class="search-bar">
                    <form id="filterForm" method="GET" class="row g-3">
                        <div class="col-md-3">
                            <div class="input-group">
                                <span class="input-group-text"><i class="fas fa-search"></i></span>
                                <input type="text" name="search" class="form-control" placeholder="Search activities..." value="<?= htmlspecialchars($search) ?>">
                                <input type="hidden" name="per_page" value="<?= $per_page ?>">
                            </div>
                        </div>
                        <div class="col-md-2">
                            <select name="action" class="form-select">
                                <option value="">All Actions</option>
                                <?php foreach ($actions as $action): ?>
                                    <option value="<?= $action['action'] ?>" <?= (isset($_GET['action']) && $_GET['action'] == $action['action']) ? 'selected' : '' ?>>
                                        <?= $action['action'] ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <select name="module" class="form-select">
                                <option value="">All Modules</option>
                                <?php foreach ($modules as $module): ?>
                                    <option value="<?= $module['table_name'] ?>" <?= (isset($_GET['module']) && $_GET['module'] == $module['table_name']) ? 'selected' : '' ?>>
                                        <?= ucfirst(str_replace('_', ' ', $module['table_name'])) ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <select name="user" class="form-select">
                                <option value="">All Users</option>
                                <?php foreach ($users as $user): ?>
                                    <option value="<?= $user['id'] ?>" <?= (isset($_GET['user']) && $_GET['user'] == $user['id']) ? 'selected' : '' ?>>
                                        <?= htmlspecialchars($user['full_name']) ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <div class="d-flex gap-2">
                                <button type="submit" class="btn btn-primary w-100">
                                    <i class="fas fa-filter"></i> Apply
                                </button>
                                <button type="button" class="btn btn-secondary" onclick="window.location.href='?per_page=<?= $per_page ?>'" title="Reset all filters">
                                    <i class="fas fa-undo"></i>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <!-- Audit Table -->
                <div class="card">
                    <div class="card-body">
                        <?php if (count($audits) > 0): ?>
                            <div class="table-responsive">
                                <table class="table table-hover table-striped">
                                    <thead class="table-dark">
                                        <tr>
                                            <th style="width: 150px;">Date/Time</th>
                                            <th style="width: 150px;">User</th>
                                            <th style="width: 100px;">Action</th>
                                            <th style="width: 130px;">Module</th>
                                            <th>Details</th>
                                            <th style="width: 80px;">Record ID</th>
                                            <th style="width: 120px;">IP Address</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach ($audits as $audit): 
                                            $action_badge = '<span class="badge bg-' . 
                                                ($audit['action'] == 'CREATE' ? 'success' : 
                                                ($audit['action'] == 'UPDATE' ? 'warning' : 
                                                ($audit['action'] == 'DELETE' ? 'danger' : 
                                                ($audit['action'] == 'LOGIN' ? 'info' : 
                                                ($audit['action'] == 'LOGOUT' ? 'secondary' : 
                                                ($audit['action'] == 'SQL_EXECUTE' ? 'danger' : 'dark')))))) . '">' . 
                                                $audit['action'] . '</span>';
                                        ?>
                                            <tr>
                                                <td>
                                                    <?= date('M d, Y', strtotime($audit['created_at'])) ?>
                                                    <br><small class="text-muted"><?= date('h:i:s A', strtotime($audit['created_at'])) ?></small>
                                                </td>
                                                <td>
                                                    <?php if ($audit['full_name']): ?>
                                                        <strong><?= htmlspecialchars($audit['full_name']) ?></strong>
                                                        <br><small class="text-muted">@<?= htmlspecialchars($audit['username']) ?></small>
                                                    <?php else: ?>
                                                        <span class="text-muted">System</span>
                                                    <?php endif; ?>
                                                </td>
                                                <td><?= $action_badge ?></td>
                                                <td>
                                                    <span class="badge bg-dark">
                                                        <?= ucfirst(str_replace('_', ' ', $audit['table_name'])) ?>
                                                    </span>
                                                </td>
                                                <td><?= htmlspecialchars($audit['details'] ?? '') ?></td>
                                                <td>
                                                    <?php if ($audit['record_id']): ?>
                                                        <span class="badge bg-secondary">#<?= $audit['record_id'] ?></span>
                                                    <?php else: ?>
                                                        <span class="text-muted">-</span>
                                                    <?php endif; ?>
                                                </td>
                                                <td><?= $audit['ip_address'] ?? '-' ?></td>
                                            </tr>
                                        <?php endforeach; ?>
                                    </tbody>
                                </table>
                            </div>

                            <!-- Pagination with Entries Per Page -->
                            <div class="pagination-container">
                                <div class="entries-info">
                                    Showing <strong><?= $start ?></strong> to <strong><?= $end ?></strong> of <strong><?= number_format($total) ?></strong> entries
                                </div>

                                <div class="per-page-selector">
                                    <label for="perPageSelect">Show</label>
                                    <select id="perPageSelect" onchange="changePerPage(this.value)">
                                        <?php foreach ($per_page_options as $option): ?>
                                            <?php 
                                            $display = ($option == 9999) ? 'All' : $option;
                                            $selected = ($per_page == $option) ? 'selected' : '';
                                            ?>
                                            <option value="<?= $option ?>" <?= $selected ?>>
                                                <?= $display ?>
                                            </option>
                                        <?php endforeach; ?>
                                    </select>
                                    <span>entries</span>
                                </div>

                                <?php if ($total_pages > 1): ?>
                                    <nav>
                                        <ul class="pagination">
                                            <li class="page-item <?= $page <= 1 ? 'disabled' : '' ?>">
                                                <a class="page-link" href="?page=<?= $page-1 ?>&search=<?= urlencode($search) ?>&action=<?= urlencode($_GET['action'] ?? '') ?>&module=<?= urlencode($_GET['module'] ?? '') ?>&user=<?= urlencode($_GET['user'] ?? '') ?>&per_page=<?= $per_page ?>">
                                                    <i class="fas fa-chevron-left"></i>
                                                </a>
                                            </li>
                                            <?php 
                                            $start_page = max(1, $page - 2);
                                            $end_page = min($total_pages, $page + 2);
                                            
                                            if ($start_page > 1): ?>
                                                <li class="page-item">
                                                    <a class="page-link" href="?page=1&search=<?= urlencode($search) ?>&action=<?= urlencode($_GET['action'] ?? '') ?>&module=<?= urlencode($_GET['module'] ?? '') ?>&user=<?= urlencode($_GET['user'] ?? '') ?>&per_page=<?= $per_page ?>">1</a>
                                                </li>
                                                <?php if ($start_page > 2): ?>
                                                    <li class="page-item disabled"><span class="page-link">...</span></li>
                                                <?php endif; ?>
                                            <?php endif; ?>
                                            
                                            <?php for ($i = $start_page; $i <= $end_page; $i++): ?>
                                                <li class="page-item <?= $i == $page ? 'active' : '' ?>">
                                                    <a class="page-link" href="?page=<?= $i ?>&search=<?= urlencode($search) ?>&action=<?= urlencode($_GET['action'] ?? '') ?>&module=<?= urlencode($_GET['module'] ?? '') ?>&user=<?= urlencode($_GET['user'] ?? '') ?>&per_page=<?= $per_page ?>"><?= $i ?></a>
                                                </li>
                                            <?php endfor; ?>
                                            
                                            <?php if ($end_page < $total_pages): ?>
                                                <?php if ($end_page < $total_pages - 1): ?>
                                                    <li class="page-item disabled"><span class="page-link">...</span></li>
                                                <?php endif; ?>
                                                <li class="page-item">
                                                    <a class="page-link" href="?page=<?= $total_pages ?>&search=<?= urlencode($search) ?>&action=<?= urlencode($_GET['action'] ?? '') ?>&module=<?= urlencode($_GET['module'] ?? '') ?>&user=<?= urlencode($_GET['user'] ?? '') ?>&per_page=<?= $per_page ?>"><?= $total_pages ?></a>
                                                </li>
                                            <?php endif; ?>
                                            
                                            <li class="page-item <?= $page >= $total_pages ? 'disabled' : '' ?>">
                                                <a class="page-link" href="?page=<?= $page+1 ?>&search=<?= urlencode($search) ?>&action=<?= urlencode($_GET['action'] ?? '') ?>&module=<?= urlencode($_GET['module'] ?? '') ?>&user=<?= urlencode($_GET['user'] ?? '') ?>&per_page=<?= $per_page ?>">
                                                    <i class="fas fa-chevron-right"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </nav>
                                <?php endif; ?>
                            </div>
                            
                        <?php else: ?>
                            <div class="text-center py-5">
                                <i class="fas fa-inbox fa-3x text-muted"></i>
                                <p class="mt-2">
                                    <?php if (!empty($search) || isset($_GET['action']) || isset($_GET['module']) || isset($_GET['user'])): ?>
                                        No audit records found matching your filters
                                    <?php else: ?>
                                        No audit records found
                                    <?php endif; ?>
                                </p>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        function changePerPage(value) {
            var currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('per_page', value);
            currentUrl.searchParams.set('page', 1);
            window.location.href = currentUrl.toString();
        }
    </script>
</body>
</html>