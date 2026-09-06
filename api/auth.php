<?php
// api/auth.php - JSON authentication endpoint for the React frontend.
// This is a NEW file; it does not replace login.php (kept for reference).
// It reuses the exact same session + DB logic as the original login.php.
require_once '../config.php';

header('Content-Type: application/json');

$action = $_GET['action'] ?? ($_POST['action'] ?? 'me');

function currentUserPayload() {
    return [
        'id' => $_SESSION['user_id'],
        'username' => $_SESSION['username'],
        'full_name' => $_SESSION['full_name'],
        'role' => $_SESSION['role'],
        'role_id' => $_SESSION['role_id'] ?? null,
    ];
}

if ($action === 'login') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['success' => false, 'message' => 'Invalid request method']);
        exit();
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $username = trim($input['username'] ?? ($_POST['username'] ?? ''));
    $password = $input['password'] ?? ($_POST['password'] ?? '');

    if ($username === '' || $password === '') {
        echo json_encode(['success' => false, 'message' => 'Username and password are required']);
        exit();
    }

    $pdo = getDB();
    $stmt = $pdo->prepare("
        SELECT u.*, r.role_name
        FROM users u
        LEFT JOIN user_roles r ON u.role_id = r.id
        WHERE u.username = ? AND u.is_active = 1
    ");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    // NOTE: plain-text password comparison, matching the existing login.php (test-only setup).
    if ($user && $password === $user['password']) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['full_name'] = $user['full_name'];
        $_SESSION['role'] = $user['role_name'];
        $_SESSION['role_id'] = $user['role_id'];

        $update = $pdo->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
        $update->execute([$user['id']]);

        logAudit($user['id'], 'LOGIN', 'users', $user['id'], 'User logged in');

        echo json_encode(['success' => true, 'user' => currentUserPayload()]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid username or password!']);
    }
    exit();
}

if ($action === 'logout') {
    if (isLoggedIn()) {
        logAudit($_SESSION['user_id'], 'LOGOUT', 'users', $_SESSION['user_id'], 'User logged out');
    }
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
    }
    session_destroy();
    echo json_encode(['success' => true]);
    exit();
}

if ($action === 'me') {
    if (isLoggedIn()) {
        echo json_encode(['success' => true, 'user' => currentUserPayload()]);
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    }
    exit();
}

http_response_code(400);
echo json_encode(['success' => false, 'message' => 'Unknown action']);
