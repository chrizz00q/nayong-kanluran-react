<?php
// api/citizen_create.php - Create a new individual_records row (a "citizen").
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
$date_of_birth = f('date_of_birth');
$place_of_birth = f('place_of_birth');
$sex = f('sex');
$civil_status = f('civil_status');
$highest_education = f('highest_education');
$educational_status = f('educational_status');
$profession = f('profession');
$philsys_number = f('philsys_number');
$email = f('email');
$mobile_number = f('mobile_number');
$telephone_number = f('telephone_number');
$region = f('region');
$province = f('province');
$city_municipality = f('city_municipality');
$barangay_address = f('barangay_address');
$house_address = f('house_address');
$street = f('street');
$subdivision = f('subdivision');
$zip_code = f('zip_code');
$blood_type = f('blood_type');
$weight = isset($_POST['weight']) && $_POST['weight'] !== '' ? (float)$_POST['weight'] : null;
$height = f('height');
$citizenship = f('citizenship');
$registered_voter = !empty($_POST['registered_voter']) ? 1 : 0;
$voter_not_resident = !empty($_POST['voter_not_resident']) ? 1 : 0;
$ethnicity = f('ethnicity');
$position_in_household = f('position_in_household');
$mother_maiden_name = f('mother_maiden_name');
$has_pet = !empty($_POST['has_pet']) ? 1 : 0;
$sectors = isset($_POST['sectors']) ? (is_array($_POST['sectors']) ? implode(',', $_POST['sectors']) : $_POST['sectors']) : null;
$sector_other = f('sector_other');

// Validate required fields
if (empty($last_name) || empty($first_name) || empty($sex) || empty($civil_status)) {
    echo json_encode(['success' => false, 'message' => 'Last name, first name, sex, and civil status are required']);
    exit();
}

$age = $date_of_birth ? calculateAge($date_of_birth) : null;

// Handle profile picture upload
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

$sql = "INSERT INTO individual_records (
    last_name, first_name, middle_name, ext_name, place_of_birth, date_of_birth, age,
    sex, civil_status, highest_education, profile_picture, created_by, educational_status,
    philsys_number, email, mobile_number, telephone_number, region, province, city_municipality,
    barangay_address, house_address, street, subdivision, zip_code, blood_type, weight, height,
    citizenship, registered_voter, voter_not_resident, ethnicity, position_in_household,
    mother_maiden_name, has_pet, sectors, sector_other, profession
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $pdo->prepare($sql);
$result = $stmt->execute([
    $last_name, $first_name, $middle_name, $ext_name, $place_of_birth, $date_of_birth, $age,
    $sex, $civil_status, $highest_education, $profile_picture, $_SESSION['user_id'], $educational_status,
    $philsys_number, $email, $mobile_number, $telephone_number, $region, $province, $city_municipality,
    $barangay_address, $house_address, $street, $subdivision, $zip_code, $blood_type, $weight, $height,
    $citizenship, $registered_voter, $voter_not_resident, $ethnicity, $position_in_household,
    $mother_maiden_name, $has_pet, $sectors, $sector_other, $profession
]);

if ($result) {
    $id = $pdo->lastInsertId();
    logAudit($_SESSION['user_id'], 'CREATE', 'individual_records', $id,
        "Added citizen: $last_name, $first_name");
    echo json_encode(['success' => true, 'id' => $id]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to save citizen']);
}
