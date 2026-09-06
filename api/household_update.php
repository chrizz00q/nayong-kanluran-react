<?php
// api/household_update.php - Update an existing household_records row.
require_once '../config.php';
requireLogin();
requirePermission('inhabitants', 'edit');

header('Content-Type: application/json');

$pdo = getDB();

$id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid ID']);
    exit();
}

$stmt = $pdo->prepare("SELECT * FROM household_records WHERE id = ?");
$stmt->execute([$id]);
$existing = $stmt->fetch();
if (!$existing) {
    echo json_encode(['success' => false, 'message' => 'Household record not found']);
    exit();
}

function f($key, $default = null) {
    return isset($_POST[$key]) && $_POST[$key] !== '' ? trim($_POST[$key]) : $default;
}

$last_name = f('last_name');
$first_name = f('first_name');
$middle_name = f('middle_name');
$ext_name = f('ext_name');
$place_of_birth = f('place_of_birth');
$date_of_birth = f('date_of_birth');
$sex = f('sex');
$civil_status = f('civil_status');
$citizenship = f('citizenship');
$occupation = f('occupation');
$profession = f('profession');
$disability = f('disability');
$pets = f('pets');
$household_type = f('household_type', 'Nuclear');
$dwelling_type = f('dwelling_type');
$household_name = f('household_name');
$position_in_household = f('position_in_household');
$tenure_status = f('tenure_status', 'Owner');
$monthly_income = isset($_POST['monthly_income']) && $_POST['monthly_income'] !== '' ? (float)$_POST['monthly_income'] : 0;
$head_of_family_id = isset($_POST['head_of_family_id']) && $_POST['head_of_family_id'] !== '' ? (int)$_POST['head_of_family_id'] : null;

if (empty($last_name) || empty($first_name) || empty($sex) || empty($civil_status)) {
    echo json_encode(['success' => false, 'message' => 'Last name, first name, sex, and civil status are required']);
    exit();
}

$age = $date_of_birth ? calculateAge($date_of_birth) : null;

$profile_picture = $existing['profile_picture'];
if (isset($_FILES['profile_picture']) && $_FILES['profile_picture']['error'] !== UPLOAD_ERR_NO_FILE) {
    $upload_result = uploadFile($_FILES['profile_picture']);
    if ($upload_result) {
        if ($existing['profile_picture']) {
            deleteFile($existing['profile_picture']);
        }
        $profile_picture = $upload_result;
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid file format. Only JPG, PNG, GIF allowed (max 2MB).']);
        exit();
    }
}

$sql = "UPDATE household_records SET
    last_name = ?, first_name = ?, middle_name = ?, ext_name = ?, place_of_birth = ?, date_of_birth = ?, age = ?,
    sex = ?, civil_status = ?, citizenship = ?, occupation = ?, profession = ?, disability = ?, pets = ?,
    profile_picture = ?, household_type = ?, dwelling_type = ?, household_name = ?, position_in_household = ?,
    tenure_status = ?, monthly_income = ?, head_of_family_id = ?
    WHERE id = ?";

$stmt = $pdo->prepare($sql);
$result = $stmt->execute([
    $last_name, $first_name, $middle_name, $ext_name, $place_of_birth, $date_of_birth, $age,
    $sex, $civil_status, $citizenship, $occupation, $profession, $disability, $pets,
    $profile_picture, $household_type, $dwelling_type, $household_name, $position_in_household,
    $tenure_status, $monthly_income, $head_of_family_id, $id
]);

if ($result) {
    logAudit($_SESSION['user_id'], 'UPDATE', 'household_records', $id,
        "Updated household record: $last_name, $first_name");
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update household record']);
}
