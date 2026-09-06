<?php
// api/reports_population_by_sector.php - JSON data for the React Population By
// Sector page, mirroring the query in reports/population_by_sector.php.
require_once '../config.php';
requireLogin();

header('Content-Type: application/json');

$pdo = getDB();

$sector_data = $pdo->query("
    SELECT
        CASE
            WHEN occupation LIKE '%Teacher%' OR occupation LIKE '%Educator%' OR occupation LIKE '%Professor%' THEN 'Education'
            WHEN occupation LIKE '%Nurse%' OR occupation LIKE '%Doctor%' OR occupation LIKE '%Medical%' OR occupation LIKE '%Health%' THEN 'Healthcare'
            WHEN occupation LIKE '%Engineer%' OR occupation LIKE '%Architect%' OR occupation LIKE '%Technical%' THEN 'Engineering & Technical'
            WHEN occupation LIKE '%Farmer%' OR occupation LIKE '%Fisher%' OR occupation LIKE '%Agricultural%' THEN 'Agriculture'
            WHEN occupation LIKE '%Driver%' OR occupation LIKE '%Pilot%' OR occupation LIKE '%Transport%' THEN 'Transportation'
            WHEN occupation LIKE '%Business%' OR occupation LIKE '%Entrepreneur%' OR occupation LIKE '%Merchant%' THEN 'Business & Trade'
            WHEN occupation LIKE '%Government%' OR occupation LIKE '%Public%' OR occupation LIKE '%Civil%' THEN 'Government Service'
            WHEN occupation LIKE '%Student%' THEN 'Student'
            WHEN occupation LIKE '%Retired%' OR occupation LIKE '%Pension%' THEN 'Retired'
            WHEN occupation IS NULL OR occupation = '' THEN 'Unemployed/Not Specified'
            ELSE 'Other'
        END as sector,
        COUNT(*) as count,
        GROUP_CONCAT(CONCAT(last_name, ', ', first_name) SEPARATOR '; ') as members
    FROM household_records
    GROUP BY sector
    ORDER BY count DESC
")->fetchAll();

$total_households = (int)$pdo->query("SELECT COUNT(*) FROM household_records")->fetchColumn();

foreach ($sector_data as &$row) {
    $row['count'] = (int)$row['count'];
}
unset($row);

echo json_encode([
    'total_households' => $total_households,
    'sector_data' => $sector_data,
]);
