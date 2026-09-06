<?php
// api/reports_population_by_street.php - JSON data for the React Population By
// Street page, mirroring the query in reports/population_by_street.php.
require_once '../config.php';
requireLogin();

header('Content-Type: application/json');

$pdo = getDB();

$street_data = $pdo->query("
    SELECT
        CASE
            WHEN street IS NOT NULL AND street != '' THEN
                TRIM(street)
            WHEN house_address IS NOT NULL AND house_address != '' THEN
                CONCAT('Block ', house_address)
            WHEN barangay_address IS NOT NULL AND barangay_address != '' THEN
                barangay_address
            ELSE
                'Unknown'
        END as street,
        COUNT(*) as count,
        GROUP_CONCAT(CONCAT(last_name, ', ', first_name) SEPARATOR '; ') as residents
    FROM individual_records
    GROUP BY street
    ORDER BY count DESC
    LIMIT 30
")->fetchAll();

$total_with_address = (int)$pdo->query("
    SELECT COUNT(*) FROM individual_records
    WHERE (street IS NOT NULL AND street != '')
       OR (house_address IS NOT NULL AND house_address != '')
       OR (barangay_address IS NOT NULL AND barangay_address != '')
")->fetchColumn();

$total_individuals = (int)$pdo->query("SELECT COUNT(*) FROM individual_records")->fetchColumn();

foreach ($street_data as &$row) {
    $row['count'] = (int)$row['count'];
}
unset($row);

echo json_encode([
    'total_individuals' => $total_individuals,
    'total_with_address' => $total_with_address,
    'street_data' => $street_data,
]);
