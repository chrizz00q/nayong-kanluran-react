<?php
// api/reports_population_by_age.php - JSON data for the React Population By Age
// page, mirroring the query in reports/population_by_age.php.
require_once '../config.php';
requireLogin();

header('Content-Type: application/json');

$pdo = getDB();

$age_distribution = $pdo->query("
    SELECT
        CASE
            WHEN age <= 17 THEN '0-17'
            WHEN age <= 25 THEN '18-25'
            WHEN age <= 35 THEN '26-35'
            WHEN age <= 45 THEN '36-45'
            WHEN age <= 55 THEN '46-55'
            WHEN age <= 65 THEN '56-65'
            ELSE '65+'
        END as age_group,
        COUNT(*) as count,
        GROUP_CONCAT(CONCAT(last_name, ', ', first_name) SEPARATOR '; ') as members
    FROM individual_records
    WHERE age IS NOT NULL
    GROUP BY age_group
    ORDER BY
        CASE
            WHEN age_group = '0-17' THEN 1
            WHEN age_group = '18-25' THEN 2
            WHEN age_group = '26-35' THEN 3
            WHEN age_group = '36-45' THEN 4
            WHEN age_group = '46-55' THEN 5
            WHEN age_group = '56-65' THEN 6
            ELSE 7
        END
")->fetchAll();

$total_population = (int)$pdo->query("SELECT COUNT(*) FROM individual_records WHERE age IS NOT NULL")->fetchColumn();

foreach ($age_distribution as &$row) {
    $row['count'] = (int)$row['count'];
}
unset($row);

echo json_encode([
    'total_population' => $total_population,
    'age_distribution' => $age_distribution,
]);
