<?php
// api/household_create.php - Create a new household_records row.
require_once '../config.php';
requireLogin();
requirePermission('inhabitants', 'add');

header('Content-Type: application/json');

$pdo = getDB();

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

$profile_picture = null;
if (isset($_FILES['profile_picture']) && $_FILES['profile_picture']['error'] !== UPLOAD_ERR_NO_FILE) {
    $upload_result = uploadFile($_FILES['profile_picture']);
    if ($upload_result) {
        $profile_picture = $upload_result;
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid file format. Only JPG, PNG, GIF allowed (max 2MB).']);
        exit();
    }
}

$sql = "INSERT INTO household_records (
    last_name, first_name, middle_name, ext_name, place_of_birth, date_of_birth, age, sex, civil_status,
    citizenship, occupation, profession, disability, pets, profile_picture, created_by,
    household_type, dwelling_type, household_name, position_in_household, tenure_status,
    monthly_income, head_of_family_id
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $pdo->prepare($sql);
$result = $stmt->execute([
    $last_name, $first_name, $middle_name, $ext_name, $place_of_birth, $date_of_birth, $age, $sex, $civil_status,
    $citizenship, $occupation, $profession, $disability, $pets, $profile_picture, $_SESSION['user_id'],
    $household_type, $dwelling_type, $household_name, $position_in_household, $tenure_status,
    $monthly_income, $head_of_family_id
]);

if ($result) {
    $id = $pdo->lastInsertId();
    logAudit($_SESSION['user_id'], 'CREATE', 'household_records', $id,
        "Added household record: $last_name, $first_name");
    echo json_encode(['success' => true, 'id' => $id]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to save household record']);
}
