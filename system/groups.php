<?php
require_once '../config.php';
requireLogin();
requirePermission('system', 'manage');

$pdo = getDB();
$success = false;
$error = '';

// Handle Add/Edit Role
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = isset($_POST['action']) ? $_POST['action'] : '';
    $role_id = isset($_POST['role_id']) ? (int)$_POST['role_id'] : 0;
    $role_name = isset($_POST['role_name']) ? trim($_POST['role_name']) : '';
    $role_description = isset($_POST['role_description']) ? trim($_POST['role_description']) : '';
    $permissions = isset($_POST['permissions']) ? $_POST['permissions'] : [];
    
    if ($action === 'add') {
        if (empty($role_name)) {
            $error = 'Role name is required';
        } else {
            // Default permissions
            $default_permissions = json_encode([
                'dashboard' => ['view'],
                'inhabitants' => ['view'],
                'demographic' => ['view'],
                'certification' => ['view'], // Only view permission
                'extras' => [],
                'reports' => [],
                'system' => []
            ]);
            
            $stmt = $pdo->prepare("INSERT INTO user_roles (role_name, role_description, permissions) VALUES (?, ?, ?)");
            if ($stmt->execute([$role_name, $role_description, $default_permissions])) {
                $success = "Role added successfully!";
                logAudit($_SESSION['user_id'], 'CREATE', 'user_roles', $pdo->lastInsertId(), "Created role: $role_name");
            } else {
                $error = "Failed to add role";
            }
        }
    } elseif ($action === 'edit') {
        if (empty($role_name)) {
            $error = 'Role name is required';
        } else {
            // Build permissions array
            $perm_array = [];
            $modules = ['dashboard', 'inhabitants', 'demographic', 'certification', 'extras', 'reports', 'system'];
            $actions = ['view', 'add', 'edit', 'delete', 'manage', 'generate', 'sql_execute', 'print'];
            
            foreach ($modules as $module) {
                $perm_array[$module] = [];
                foreach ($actions as $action_name) {
                    $key = $module . '_' . $action_name;
                    if (isset($permissions[$key]) && $permissions[$key] == 'on') {
                        $perm_array[$module][] = $action_name;
                    }
                }
            }
            
            $permissions_json = json_encode($perm_array);
            
            $stmt = $pdo->prepare("UPDATE user_roles SET role_name = ?, role_description = ?, permissions = ? WHERE id = ?");
            if ($stmt->execute([$role_name, $role_description, $permissions_json, $role_id])) {
                $success = "Role updated successfully!";
                logAudit($_SESSION['user_id'], 'UPDATE', 'user_roles', $role_id, "Updated role: $role_name");
            } else {
                $error = "Failed to update role";
            }
        }
    } elseif ($action === 'delete') {
        $role_id = isset($_POST['role_id']) ? (int)$_POST['role_id'] : 0;
        
        // Check if role is in use
        $check = $pdo->prepare("SELECT COUNT(*) FROM users WHERE role_id = ?");
        $check->execute([$role_id]);
        if ($check->fetchColumn() > 0) {
            $error = "Cannot delete role. It is currently assigned to users.";
        } else {
            $stmt = $pdo->prepare("DELETE FROM user_roles WHERE id = ?");
            if ($stmt->execute([$role_id])) {
                $success = "Role deleted successfully!";
                logAudit($_SESSION['user_id'], 'DELETE', 'user_roles', $role_id, "Deleted role");
            } else {
                $error = "Failed to delete role";
            }
        }
    }
}

// Get all roles with user count
$roles = $pdo->query("
    SELECT r.*, COUNT(u.id) as user_count 
    FROM user_roles r 
    LEFT JOIN users u ON r.id = u.role_id 
    GROUP BY r.id 
    ORDER BY r.id
")->fetchAll();

// Get role details for editing (with permissions)
$edit_role = null;
if (isset($_GET['edit']) && $_GET['edit'] > 0) {
    $stmt = $pdo->prepare("SELECT * FROM user_roles WHERE id = ?");
    $stmt->execute([$_GET['edit']]);
    $edit_role = $stmt->fetch();
}

// Define modules and actions
$modules = [
    'dashboard' => ['label' => 'Dashboard', 'icon' => 'fa-chart-pie'],
    'inhabitants' => ['label' => 'Inhabitants', 'icon' => 'fa-users'],
    'demographic' => ['label' => 'Demographic', 'icon' => 'fa-chart-bar'],
    'certification' => ['label' => 'Certification', 'icon' => 'fa-certificate'],
    'extras' => ['label' => 'Extras', 'icon' => 'fa-car'],
    'reports' => ['label' => 'Reports', 'icon' => 'fa-file-alt'],
    'system' => ['label' => 'System', 'icon' => 'fa-cogs']
];

$actions = [
    'view' => ['label' => 'View', 'color' => 'info'],
    'add' => ['label' => 'Add', 'color' => 'success'],
    'edit' => ['label' => 'Edit', 'color' => 'warning'],
    'delete' => ['label' => 'Delete', 'color' => 'danger'],
    'manage' => ['label' => 'Manage', 'color' => 'primary'],
    'generate' => ['label' => 'Generate', 'color' => 'secondary'],
    'sql_execute' => ['label' => 'SQL Execute', 'color' => 'dark'],
    'print' => ['label' => 'Print', 'color' => 'info']
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Users Group - RBIS</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/dataTables.bootstrap5.min.css">
    <link rel="stylesheet" href="../assets/css/custom.css">
    <style>
        .permission-card {
            border-radius: 12px;
            transition: transform 0.3s;
            height: 100%;
        }
        .permission-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }
        .permission-header {
            border-bottom: 2px solid #e9ecef;
            padding-bottom: 10px;
            margin-bottom: 10px;
        }
        .permission-header i {
            font-size: 1.2rem;
            margin-right: 8px;
        }
        .permission-checkbox {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        .permission-checkbox .form-check {
            padding-left: 0;
            margin-right: 10px;
        }
        .permission-checkbox .form-check .form-check-input {
            margin-left: 0;
            margin-right: 5px;
        }
        .permission-checkbox .form-check .form-check-label {
            font-size: 0.8rem;
            font-weight: 500;
        }
        .role-badge {
            padding: 5px 12px;
            border-radius: 20px;
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
        .disabled-permission {
            opacity: 0.5;
            pointer-events: none;
        }
        .permission-note {
            font-size: 0.75rem;
            color: #6c757d;
            font-style: italic;
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
                        <i class="fas fa-user-tag text-primary"></i> Users Group / Roles
                        <span class="badge bg-primary ms-2"><?= count($roles) ?> Roles</span>
                    </h1>
                    <button class="btn btn-success" onclick="openAddModal()">
                        <i class="fas fa-plus"></i> Add New Role
                    </button>
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
                    <div class="col-md-4">
                        <div class="stat-card bg-primary text-white">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <div class="stat-number"><?= count($roles) ?></div>
                                    <div class="stat-label">Total Roles</div>
                                </div>
                                <div class="stat-icon">
                                    <i class="fas fa-user-tag"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="stat-card bg-success text-white">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <div class="stat-number">
                                        <?= count(array_filter($roles, fn($r) => $r['user_count'] > 0)) ?>
                                    </div>
                                    <div class="stat-label">Roles with Users</div>
                                </div>
                                <div class="stat-icon">
                                    <i class="fas fa-users"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="stat-card bg-info text-white">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <div class="stat-number">
                                        <?= count(array_filter($roles, fn($r) => $r['user_count'] == 0)) ?>
                                    </div>
                                    <div class="stat-label">Empty Roles</div>
                                </div>
                                <div class="stat-icon">
                                    <i class="fas fa-user-slash"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Roles Table -->
                <div class="card">
                    <div class="card-body">
                        <div class="table-responsive">
                            <table id="rolesTable" class="table table-hover table-striped">
                                <thead class="table-dark">
                                    <tr>
                                        <th>ID</th>
                                        <th>Role Name</th>
                                        <th>Description</th>
                                        <th>Users</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($roles as $role): ?>
                                        <?php 
                                        $permissions = json_decode($role['permissions'] ?? '{}', true);
                                        $perm_count = 0;
                                        foreach ($permissions as $perm) {
                                            $perm_count += count($perm);
                                        }
                                        ?>
                                        <tr>
                                            <td><?= $role['id'] ?></td>
                                            <td>
                                                <span class="badge bg-<?= 
                                                    $role['role_name'] == 'superadmin' ? 'danger' : 
                                                    ($role['role_name'] == 'admin' ? 'primary' : 
                                                    ($role['role_name'] == 'editor' ? 'success' : 'warning')) 
                                                ?> role-badge">
                                                    <?= strtoupper($role['role_name']) ?>
                                                </span>
                                            </td>
                                            <td><?= htmlspecialchars($role['role_description']) ?></td>
                                            <td>
                                                <span class="badge bg-info"><?= $role['user_count'] ?></span>
                                                <small class="text-muted ms-1">(<?= $perm_count ?> permissions)</small>
                                            </td>
                                            <td><?= date('M d, Y', strtotime($role['created_at'])) ?></td>
                                            <td>
                                                <div class="btn-group btn-group-sm">
                                                    <a href="?edit=<?= $role['id'] ?>" class="btn btn-warning" title="Edit Permissions">
                                                        <i class="fas fa-key"></i>
                                                    </a>
                                                    <?php if ($role['role_name'] != 'superadmin'): ?>
                                                        <button onclick="deleteRole(<?= $role['id'] ?>, '<?= addslashes($role['role_name']) ?>')" class="btn btn-danger" title="Delete">
                                                            <i class="fas fa-trash"></i>
                                                        </button>
                                                    <?php endif; ?>
                                                </div>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <!-- Add/Edit Permission Modal -->
    <div class="modal fade" id="permissionModal" tabindex="-1" data-bs-backdrop="static">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalTitle">
                        <?php if ($edit_role): ?>
                            <i class="fas fa-edit text-warning"></i> Edit Role: <strong><?= ucfirst($edit_role['role_name']) ?></strong>
                        <?php else: ?>
                            <i class="fas fa-user-tag text-primary"></i> Add New Role
                        <?php endif; ?>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" onclick="closeModal()"></button>
                </div>
                <div class="modal-body">
                    <form id="roleForm" method="POST">
                        <input type="hidden" name="action" id="formAction" value="<?= $edit_role ? 'edit' : 'add' ?>">
                        <input type="hidden" name="role_id" id="roleId" value="<?= $edit_role['id'] ?? '' ?>">
                        
                        <!-- Basic Info -->
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label">Role Name <span class="text-danger">*</span></label>
                                <input type="text" name="role_name" id="roleName" class="form-control" 
                                       value="<?= $edit_role['role_name'] ?? '' ?>" required>
                                <small class="text-muted">Use lowercase without spaces (e.g., superadmin, admin)</small>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Description</label>
                                <input type="text" name="role_description" id="roleDescription" class="form-control" 
                                       value="<?= htmlspecialchars($edit_role['role_description'] ?? '') ?>">
                            </div>
                        </div>

                        <!-- Permissions -->
                        <h6 class="mb-3"><i class="fas fa-key text-primary"></i> Permissions</h6>
                        <p class="text-muted small">Check the permissions you want to grant for each module.</p>
                        
                        <div class="alert alert-info alert-sm">
                            <i class="fas fa-info-circle"></i> 
                            <strong>Note:</strong> Certification module only supports <strong>View</strong> and <strong>Print</strong> permissions (Add, Edit, Delete are not available).
                        </div>
                        
                        <?php 
                        $current_perms = [];
                        if ($edit_role && isset($edit_role['permissions'])) {
                            $current_perms = json_decode($edit_role['permissions'], true) ?? [];
                        }
                        ?>
                        
                        <div class="row">
                            <?php foreach ($modules as $module_key => $module): ?>
                                <div class="col-md-6 col-lg-4 mb-3">
                                    <div class="card permission-card">
                                        <div class="card-body">
                                            <div class="permission-header">
                                                <i class="fas <?= $module['icon'] ?> text-primary"></i>
                                                <strong><?= $module['label'] ?></strong>
                                            </div>
                                            <div class="permission-checkbox">
                                                <?php foreach ($actions as $action_key => $action): ?>
                                                    <?php 
                                                    // Disable Add, Edit, Delete for Certification module
                                                    $is_disabled = false;
                                                    $disabled_reason = '';
                                                    if ($module_key === 'certification' && in_array($action_key, ['add', 'edit', 'delete'])) {
                                                        $is_disabled = true;
                                                        $disabled_reason = ' (Not available for Certification)';
                                                    }
                                                    
                                                    // Check if permission is active
                                                    $checked = false;
                                                    if (isset($current_perms[$module_key]) && in_array($action_key, $current_perms[$module_key])) {
                                                        $checked = true;
                                                    }
                                                    // SuperAdmin always has all permissions
                                                    if ($edit_role && $edit_role['role_name'] == 'superadmin') {
                                                        $checked = true;
                                                    }
                                                    
                                                    $input_id = $module_key . '_' . $action_key;
                                                    ?>
                                                    <div class="form-check <?= $is_disabled ? 'disabled-permission' : '' ?>">
                                                        <input type="checkbox" name="permissions[<?= $input_id ?>]" 
                                                               id="perm_<?= $input_id ?>" class="form-check-input" 
                                                               <?= $checked ? 'checked' : '' ?>
                                                               <?= ($edit_role && $edit_role['role_name'] == 'superadmin') ? 'disabled' : '' ?>
                                                               <?= $is_disabled ? 'disabled' : '' ?>>
                                                        <label class="form-check-label" for="perm_<?= $input_id ?>">
                                                            <span class="badge bg-<?= $action['color'] ?>"><?= $action['label'] ?></span>
                                                            <?= $disabled_reason ?>
                                                        </label>
                                                    </div>
                                                <?php endforeach; ?>
                                            </div>
                                            <?php if ($module_key === 'certification'): ?>
                                                <div class="permission-note mt-2">
                                                    <i class="fas fa-lock"></i> Only View and Print available
                                                </div>
                                            <?php endif; ?>
                                        </div>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>

                        <?php if ($edit_role && $edit_role['role_name'] == 'superadmin'): ?>
                            <div class="alert alert-info mt-2">
                                <i class="fas fa-info-circle"></i> SuperAdmin has all permissions by default and cannot be modified.
                            </div>
                        <?php endif; ?>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                    <button type="button" class="btn btn-primary" onclick="saveRole()">
                        <i class="fas fa-save"></i> Save Role
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Delete Modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title"><i class="fas fa-exclamation-triangle text-danger"></i> Confirm Delete</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to delete this role?</p>
                    <p class="text-danger"><small>This action cannot be undone!</small></p>
                    <div id="deletePreview" class="alert alert-secondary">
                        <strong id="deleteName"></strong>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <form method="POST">
                        <input type="hidden" name="action" value="delete">
                        <input type="hidden" name="role_id" id="deleteId">
                        <button type="submit" class="btn btn-danger">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.6/js/dataTables.bootstrap5.min.js"></script>
    
    <script>
        var permissionModal;
        var deleteModal;
        var isEdit = <?= $edit_role ? 'true' : 'false' ?>;
        
        $(document).ready(function() {
            deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
            permissionModal = new bootstrap.Modal(document.getElementById('permissionModal'));
            
            <?php if ($edit_role): ?>
                permissionModal.show();
            <?php endif; ?>
            
            $('#rolesTable').DataTable({
                pageLength: 25,
                order: [[0, 'asc']],
                language: {
                    search: 'Search:',
                    lengthMenu: 'Show _MENU_ entries',
                    info: 'Showing _START_ to _END_ of _TOTAL_ roles'
                }
            });
        });
        
        function openAddModal() {
            window.location.href = 'groups.php?add=1';
        }
        
        function saveRole() {
            var form = $('#roleForm');
            var formData = form.serialize();
            
            var saveBtn = $('.modal-footer .btn-primary');
            saveBtn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Saving...');
            
            $.ajax({
                url: 'groups.php',
                type: 'POST',
                data: formData,
                success: function(response) {
                    window.location.href = 'groups.php?success=1';
                },
                error: function() {
                    saveBtn.prop('disabled', false).html('<i class="fas fa-save"></i> Save Role');
                    alert('An error occurred. Please try again.');
                }
            });
        }
        
        function closeModal() {
            window.location.href = 'groups.php';
        }
        
        function deleteRole(id, name) {
            document.getElementById('deleteId').value = id;
            document.getElementById('deleteName').textContent = 'Role: ' + name;
            deleteModal.show();
        }
    </script>
</body>
</html>