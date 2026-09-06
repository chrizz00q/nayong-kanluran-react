-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 14, 2026 at 06:26 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rbis_db`
--

-- --------------------------------------------------------

--
-- Stand-in structure for view `age_distribution`
-- (See below for the actual view)
--
CREATE TABLE `age_distribution` (
`age_group` varchar(5)
,`count` bigint(21)
);

-- --------------------------------------------------------

--
-- Table structure for table `audit_trails`
--

CREATE TABLE `audit_trails` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(50) NOT NULL,
  `table_name` varchar(50) NOT NULL,
  `record_id` int(11) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `audit_trails`
--

INSERT INTO `audit_trails` (`id`, `user_id`, `action`, `table_name`, `record_id`, `details`, `ip_address`, `created_at`) VALUES
(1, 2, 'LOGIN', 'users', 2, 'User logged in', '::1', '2026-07-25 10:44:29'),
(2, 2, 'LOGOUT', 'users', 2, 'User logged out', '::1', '2026-07-25 10:51:59'),
(3, 1, 'LOGIN', 'users', 1, 'User logged in', '::1', '2026-07-25 10:52:05'),
(4, 1, 'CREATE', 'household_records', 1, 'Added household: Nimrod Palomar', '::1', '2026-07-25 10:57:54'),
(5, 1, 'CREATE', 'individual_records', 1, 'Added citizen: Nimrod Palomar', '::1', '2026-07-25 10:58:17'),
(6, 1, 'CREATE', 'individual_records', 2, 'Added citizen: Ralvin Valiente', '::1', '2026-07-25 11:02:06'),
(7, 1, 'VIEW', 'individual_records', 2, 'Viewed citizen: Ralvin Valiente', '::1', '2026-07-25 11:02:08'),
(8, 1, 'CREATE', 'individual_records', 3, 'Added citizen: Christian Cuescano', '::1', '2026-07-25 11:11:53'),
(9, 1, 'VIEW', 'individual_records', 3, 'Viewed citizen: Christian Cuescano', '::1', '2026-07-25 11:11:54'),
(10, 1, 'CREATE', 'household_records', 2, 'Added household: Ralvin Valiente', '::1', '2026-07-25 11:16:17'),
(11, 1, 'CREATE', 'individual_records', 4, 'Added citizen: AEN DEE', '::1', '2026-07-25 11:26:45'),
(12, 1, 'VIEW', 'individual_records', 4, 'Viewed citizen: AEN DEE', '::1', '2026-07-25 11:26:47'),
(13, 1, 'DELETE', 'household_records', 2, 'Deleted household: Ralvin Valiente', '::1', '2026-07-25 11:33:07'),
(14, 1, 'DELETE', 'household_records', 1, 'Deleted household: Nimrod Palomar', '::1', '2026-07-25 11:33:08'),
(15, 1, 'CREATE', 'household_records', 3, 'Added household: Nimrod Palomar', '::1', '2026-07-25 11:34:16'),
(16, 1, 'VIEW', 'household_records', 3, 'Viewed household: Nimrod Palomar', '::1', '2026-07-25 11:37:29'),
(17, 1, 'LOGOUT', 'users', 1, 'User logged out', '::1', '2026-07-25 12:00:06'),
(18, 2, 'LOGIN', 'users', 2, 'User logged in', '::1', '2026-07-25 12:03:55'),
(19, 2, 'LOGOUT', 'users', 2, 'User logged out', '::1', '2026-07-25 12:03:58'),
(20, 4, 'LOGIN', 'users', 4, 'User logged in', '::1', '2026-07-25 12:04:03'),
(21, 4, 'LOGOUT', 'users', 4, 'User logged out', '::1', '2026-07-25 12:04:08'),
(22, 3, 'LOGIN', 'users', 3, 'User logged in', '::1', '2026-07-25 12:04:17'),
(23, 3, 'LOGOUT', 'users', 3, 'User logged out', '::1', '2026-07-25 12:04:19'),
(24, 1, 'LOGIN', 'users', 1, 'User logged in', '::1', '2026-07-25 12:04:24'),
(25, 1, 'LOGIN', 'users', 1, 'User logged in', '::1', '2026-08-04 07:32:43'),
(26, 1, 'LOGIN', 'users', 1, 'User logged in', '::1', '2026-08-06 09:33:31'),
(27, 1, 'LOGIN', 'users', 1, 'User logged in', '::1', '2026-08-07 09:56:49'),
(28, 1, 'VIEW', 'individual_records', 4, 'Viewed citizen: AEN DEE', '::1', '2026-08-07 10:33:38'),
(29, 1, 'CREATE', 'individual_records', 5, 'Added citizen: Miles Morales', '::1', '2026-08-07 10:36:31'),
(30, 1, 'VIEW', 'individual_records', 5, 'Viewed citizen: Miles Morales', '::1', '2026-08-07 10:36:33'),
(31, 1, 'DELETE', 'individual_records', 4, 'Deleted citizen: AEN DEE', '::1', '2026-08-07 10:37:26'),
(32, 1, 'DELETE', 'individual_records', 3, 'Deleted citizen: Christian Cuescano', '::1', '2026-08-07 10:37:29'),
(33, 1, 'DELETE', 'individual_records', 2, 'Deleted citizen: Ralvin Valiente', '::1', '2026-08-07 10:37:31'),
(34, 1, 'DELETE', 'individual_records', 1, 'Deleted citizen: Nimrod Palomar', '::1', '2026-08-07 10:37:33'),
(35, 1, 'VIEW', 'individual_records', 5, 'Viewed citizen: Miles Morales', '::1', '2026-08-07 10:38:52'),
(36, 1, 'VIEW', 'individual_records', 5, 'Viewed citizen: Miles Morales', '::1', '2026-08-07 10:39:20'),
(37, 1, 'VIEW', 'household_records', 3, 'Viewed household: Nimrod Palomar', '::1', '2026-08-07 10:39:53'),
(38, 1, 'VIEW', 'individual_records', 5, 'Viewed citizen: Miles Morales', '::1', '2026-08-07 10:40:06'),
(39, 1, 'VIEW', 'individual_records', 5, 'Viewed citizen: Miles Morales', '::1', '2026-08-07 10:41:47'),
(40, 1, 'VIEW', 'individual_records', 5, 'Viewed citizen: Miles Morales', '::1', '2026-08-07 10:42:09'),
(41, 1, 'LOGIN', 'users', 1, 'User logged in', '::1', '2026-08-07 11:57:57'),
(42, 1, 'VIEW', 'individual_records', 5, 'Viewed citizen: Miles Morales', '::1', '2026-08-07 11:58:03'),
(43, 1, 'VIEW', 'individual_records', 5, 'Viewed citizen: Miles Morales', '::1', '2026-08-07 12:01:32'),
(44, 1, 'VIEW', 'individual_records', 5, 'Viewed citizen: Miles Morales', '::1', '2026-08-07 12:09:27'),
(45, 1, 'UPDATE', 'individual_records', 5, 'Updated citizen: Miles Morales', '::1', '2026-08-07 12:09:39'),
(46, 1, 'CREATE', 'individual_records', 6, 'Added citizen: Rio Valiente', '::1', '2026-08-07 12:17:23'),
(47, 1, 'VIEW', 'individual_records', 6, 'Viewed citizen: Rio Valiente', '::1', '2026-08-07 12:17:26'),
(48, 1, 'CREATE', 'household_records', 4, 'Added household: Rio Valiente', '::1', '2026-08-07 12:22:06'),
(49, 1, 'VIEW', 'household_records', 4, 'Viewed household: Rio Valiente', '::1', '2026-08-07 12:22:07'),
(50, 1, 'VIEW', 'household_records', 4, 'Viewed household: Rio Valiente', '::1', '2026-08-07 12:22:16'),
(51, 1, 'VIEW', 'household_records', 3, 'Viewed household: Nimrod Palomar', '::1', '2026-08-07 12:22:32'),
(52, 1, 'CREATE', 'pets', 1, 'Added pet: Bailey (Dog)', '::1', '2026-08-07 12:37:03'),
(53, 1, 'UPDATE', 'individual_records', 6, 'Updated citizen: Rio Valiente', '::1', '2026-08-07 12:37:38'),
(54, 1, 'VIEW', 'individual_records', 6, 'Viewed citizen: Rio Valiente', '::1', '2026-08-07 12:37:40'),
(55, 1, 'LOGOUT', 'users', 1, 'User logged out', '::1', '2026-08-07 12:39:49'),
(56, 1, 'LOGIN', 'users', 1, 'User logged in', '::1', '2026-08-07 12:40:28'),
(57, 1, 'LOGIN', 'users', 1, 'User logged in', '::1', '2026-08-13 09:05:35'),
(58, 1, 'UPDATE', 'system_settings', NULL, 'System settings updated', '::1', '2026-08-13 09:11:14'),
(59, 1, 'UPDATE', 'system_settings', NULL, 'System settings updated', '::1', '2026-08-13 09:11:16'),
(60, 1, 'UPDATE', 'system_settings', NULL, 'System settings updated', '::1', '2026-08-13 09:11:23'),
(61, 1, 'CREATE', 'users', 10, 'Created user: test', '::1', '2026-08-13 09:12:37'),
(62, 1, 'BACKUP', 'database', NULL, 'Created backup: rbis_backup_2026-08-13_11-14-39.sql', '::1', '2026-08-13 09:14:39'),
(63, 1, 'DELETE_BACKUP', 'database', NULL, 'Deleted backup: rbis_backup_2026-08-13_11-14-39.sql', '::1', '2026-08-13 09:14:49'),
(64, 1, 'DELETE', 'users', 10, 'Deleted user: test (test)', '::1', '2026-08-13 09:18:38'),
(65, 1, 'LOGIN', 'users', 1, 'User logged in', '::1', '2026-08-14 10:44:36'),
(66, 1, 'CREATE', 'individual_records', 7, 'Added citizen: Nimrod Palomar', '::1', '2026-08-14 10:55:18'),
(67, 1, 'VIEW', 'individual_records', 7, 'Viewed citizen: Nimrod Palomar', '::1', '2026-08-14 10:55:20'),
(68, 1, 'DELETE', 'individual_records', 7, 'Deleted citizen: Nimrod Palomar', '::1', '2026-08-14 10:55:30'),
(69, 1, 'CREATE', 'individual_records', 8, 'Added citizen: Natasha Allianovna', '::1', '2026-08-14 11:03:11'),
(70, 1, 'CREATE', 'household_records', 5, 'Added household: Romanoff with 1 members', '::1', '2026-08-14 11:12:31'),
(71, 1, 'VIEW', 'household_records', 5, 'Viewed household: Natasha Allianovna', '::1', '2026-08-14 11:12:33'),
(72, 1, 'VIEW', 'household_records', 5, 'Viewed household: Natasha Allianovna', '::1', '2026-08-14 11:12:50'),
(73, 1, 'VIEW', 'individual_records', 8, 'Viewed citizen: Natasha Allianovna', '::1', '2026-08-14 11:13:21'),
(74, 1, 'VIEW', 'individual_records', 8, 'Viewed citizen: Natasha Allianovna', '::1', '2026-08-14 11:13:43'),
(75, 1, 'VIEW', 'individual_records', 8, 'Viewed citizen: Natasha Allianovna', '::1', '2026-08-14 11:13:49'),
(76, 1, 'UPDATE', 'individual_records', 8, 'Updated citizen: Natasha Allianovna', '::1', '2026-08-14 11:16:53'),
(77, 1, 'DELETE', 'household_records', 5, 'Deleted household: Natasha Allianovna', '::1', '2026-08-14 11:17:22'),
(78, 1, 'CREATE', 'household_records', 6, 'Added household: Romanoff with 1 members', '::1', '2026-08-14 11:18:20'),
(79, 1, 'DELETE', 'household_records', 4, 'Deleted household: Rio Valiente', '::1', '2026-08-14 11:18:26'),
(80, 1, 'DELETE', 'household_records', 3, 'Deleted household: Nimrod Palomar', '::1', '2026-08-14 11:18:28'),
(81, 1, 'CREATE', 'individual_records', 9, 'Added citizen: Steve Rogers', '::1', '2026-08-14 11:22:03'),
(82, 1, 'VIEW', 'individual_records', 9, 'Viewed citizen: Steve Rogers', '::1', '2026-08-14 11:22:04'),
(83, 1, 'DELETE', 'individual_records', 6, 'Deleted citizen: Rio Valiente', '::1', '2026-08-14 11:22:14'),
(84, 1, 'DELETE', 'individual_records', 5, 'Deleted citizen: Miles Morales', '::1', '2026-08-14 11:22:16'),
(85, 1, 'CREATE', 'individual_records', 10, 'Added citizen: Wanda Maximoff', '::1', '2026-08-14 11:27:09'),
(86, 1, 'VIEW', 'individual_records', 10, 'Viewed citizen: Wanda Maximoff', '::1', '2026-08-14 11:27:10'),
(87, 1, 'CREATE', 'individual_records', 11, 'Added citizen: Pietro Maximoff', '::1', '2026-08-14 11:29:40'),
(88, 1, 'VIEW', 'individual_records', 11, 'Viewed citizen: Pietro Maximoff', '::1', '2026-08-14 11:29:42'),
(89, 1, 'CREATE', 'household_records', 7, 'Added household: Maximoff with 1 members', '::1', '2026-08-14 11:30:51'),
(90, 1, 'VIEW', 'household_records', 7, 'Viewed household: Pietro Maximoff', '::1', '2026-08-14 11:30:53'),
(91, 1, 'UPDATE', 'household_records', 7, 'Updated household: Maximoff', '::1', '2026-08-14 11:34:15'),
(92, 1, 'UPDATE', 'individual_records', 13, 'Updated citizen: Pepper Stark', '::1', '2026-08-14 11:53:43'),
(93, 1, 'UPDATE', 'individual_records', 12, 'Updated citizen: Tony Stark', '::1', '2026-08-14 11:54:44'),
(94, 1, 'DELETE', 'household_records', 9, 'Deleted household: Pepper Stark', '::1', '2026-08-14 11:58:52'),
(95, 1, 'DELETE', 'household_records', 8, 'Deleted household: Tony Stark', '::1', '2026-08-14 11:58:54'),
(96, 1, 'CREATE', 'household_records', 10, 'Added household: Stark with 1 members', '::1', '2026-08-14 11:59:59'),
(97, 1, 'VIEW', 'household_records', 10, 'Viewed household: Tony Stark', '::1', '2026-08-14 12:00:01'),
(98, 1, 'UPDATE', 'household_records', 10, 'Updated household: Stark', '::1', '2026-08-14 12:00:23'),
(99, 1, 'VIEW', 'individual_records', 13, 'Viewed citizen: Pepper Stark', '::1', '2026-08-14 12:00:35'),
(100, 1, 'UPDATE', 'individual_records', 13, 'Updated citizen: Pepper Stark', '::1', '2026-08-14 12:00:44'),
(101, 1, 'VIEW', 'individual_records', 12, 'Viewed citizen: Tony Stark', '::1', '2026-08-14 12:00:47'),
(102, 1, 'UPDATE', 'individual_records', 12, 'Updated citizen: Tony Stark', '::1', '2026-08-14 12:00:54'),
(103, 1, 'UPDATE', 'household_records', 7, 'Updated household: Maximoff', '::1', '2026-08-14 12:01:28'),
(104, 1, 'UPDATE', 'individual_records', 14, 'Updated citizen: Bruce Banner', '::1', '2026-08-14 12:05:48'),
(105, 1, 'UPDATE', 'individual_records', 15, 'Updated citizen: Yelena Belova', '::1', '2026-08-14 12:11:16'),
(106, 1, 'UPDATE', 'household_records', 6, 'Updated household: Romanoff', '::1', '2026-08-14 12:12:02'),
(107, 1, 'UPDATE', 'household_records', 6, 'Updated household: Romanoff', '::1', '2026-08-14 12:12:31'),
(108, 1, 'UPDATE', 'household_records', 6, 'Updated household: Romanoff with 1 members', '::1', '2026-08-14 12:17:54'),
(109, 1, 'VIEW', 'household_records', 6, 'Viewed household: Natasha Allianovna', '::1', '2026-08-14 12:18:04'),
(110, 1, 'UPDATE', 'household_records', 6, 'Updated household: Romanoff with 2 members', '::1', '2026-08-14 12:18:23'),
(111, 1, 'UPDATE', 'household_records', 6, 'Updated household: Romanoff with 2 members', '::1', '2026-08-14 12:19:00'),
(112, 1, 'UPDATE', 'household_records', 10, 'Updated household: Stark with 1 members', '::1', '2026-08-14 12:20:08'),
(113, 1, 'DELETE', 'individual_records', 18, 'Deleted citizen: Steven Strange', '::1', '2026-08-14 12:37:27'),
(114, 1, 'VIEW', 'individual_records', 17, 'Viewed citizen: Steven Strange', '::1', '2026-08-14 12:39:06'),
(115, 1, 'DELETE', 'pets', 1, 'Deleted pet: Bailey', '::1', '2026-08-14 12:45:08'),
(116, 1, 'CREATE', 'pets', 2, 'Added pet: Bailey (Dog)', '::1', '2026-08-14 12:47:02'),
(117, 1, 'UPDATE', 'pets', 2, 'Updated pet: Bailey (Dog)', '::1', '2026-08-14 12:47:25'),
(118, 1, 'UPDATE', 'pets', 2, 'Updated pet: Bailey (Dog)', '::1', '2026-08-14 12:50:54'),
(119, 1, 'CREATE', 'household_records', 11, 'Added household: Rogers with 1 members', '::1', '2026-08-14 13:55:24'),
(120, 1, 'VIEW', 'household_records', 11, 'Viewed household: Steve Rogers', '::1', '2026-08-14 13:55:26'),
(121, 1, 'UPDATE', 'individual_records', 19, 'Updated citizen: Peggy Carter', '::1', '2026-08-14 13:57:01'),
(122, 1, 'UPDATE', 'individual_records', 9, 'Updated citizen: Steve Rogers', '::1', '2026-08-14 13:57:15'),
(123, 1, 'UPDATE', 'individual_records', 9, 'Updated citizen: Steve Rogers', '::1', '2026-08-14 13:57:18'),
(124, 1, 'VIEW', 'individual_records', 20, 'Viewed citizen: Clint Barton', '::1', '2026-08-14 14:02:26'),
(125, 1, 'VIEW', 'household_records', 11, 'Viewed household: Steve Rogers', '::1', '2026-08-14 14:03:23'),
(126, 1, 'UPDATE', 'household_records', 11, 'Updated household: Rogers with 2 members', '::1', '2026-08-14 14:06:57'),
(127, 1, 'VIEW', 'household_records', 11, 'Viewed household: Steve Rogers', '::1', '2026-08-14 14:07:01'),
(128, 1, 'VIEW', 'household_records', 11, 'Viewed household: Rogers', '::1', '2026-08-14 14:12:47'),
(129, 1, 'VIEW', 'household_records', 10, 'Viewed household: Stark', '::1', '2026-08-14 14:12:53'),
(130, 1, 'VIEW', 'individual_records', 12, 'Viewed citizen: Tony Stark', '::1', '2026-08-14 14:12:59'),
(131, 1, 'VIEW', 'household_records', 7, 'Viewed household: Maximoff', '::1', '2026-08-14 14:13:08'),
(132, 1, 'VIEW', 'household_records', 10, 'Viewed household: Stark', '::1', '2026-08-14 14:13:11'),
(133, 1, 'VIEW', 'household_records', 11, 'Viewed household: Rogers', '::1', '2026-08-14 14:13:16'),
(134, 1, 'VIEW', 'household_records', 6, 'Viewed household: Allianovna', '::1', '2026-08-14 14:13:18'),
(135, 1, 'VIEW', 'household_records', 11, 'Viewed household: Rogers', '::1', '2026-08-14 14:17:09'),
(136, 1, 'VIEW', 'household_records', 11, 'Viewed household: Rogers', '::1', '2026-08-14 14:19:02'),
(137, 1, 'VIEW', 'household_records', 11, 'Viewed household: Rogers', '::1', '2026-08-14 14:19:07'),
(138, 1, 'UPDATE', 'household_records', 11, 'Updated household: Rogers with 2 members', '::1', '2026-08-14 14:19:22'),
(139, 1, 'VIEW', 'household_records', 11, 'Viewed household: Rogers', '::1', '2026-08-14 14:19:24'),
(140, 1, 'VIEW', 'household_records', 10, 'Viewed household: Stark', '::1', '2026-08-14 14:19:35'),
(141, 1, 'VIEW', 'household_records', 11, 'Viewed household: Rogers', '::1', '2026-08-14 14:19:38'),
(142, 1, 'VIEW', 'household_records', 7, 'Viewed household: Maximoff', '::1', '2026-08-14 14:19:39'),
(143, 1, 'VIEW', 'household_records', 11, 'Viewed household: Rogers', '::1', '2026-08-14 14:19:41'),
(144, 1, 'VIEW', 'household_records', 10, 'Viewed household: Stark', '::1', '2026-08-14 14:19:44'),
(145, 1, 'UPDATE', 'household_records', 10, 'Updated household: Stark with 2 members', '::1', '2026-08-14 14:19:59'),
(146, 1, 'VIEW', 'household_records', 10, 'Viewed household: Stark', '::1', '2026-08-14 14:20:02'),
(147, 1, 'UPDATE', 'household_records', 11, 'Updated household: Rogers with 2 members', '::1', '2026-08-14 14:22:21'),
(148, 1, 'VIEW', 'household_records', 11, 'Viewed household: Rogers', '::1', '2026-08-14 14:22:23'),
(149, 1, 'UPDATE', 'household_records', 11, 'Updated household: Rogers with 2 members', '::1', '2026-08-14 14:24:23'),
(150, 1, 'VIEW', 'household_records', 11, 'Viewed household: Rogers', '::1', '2026-08-14 14:24:24'),
(151, 1, 'VIEW', 'household_records', 10, 'Viewed household: Stark', '::1', '2026-08-14 14:24:28'),
(152, 1, 'VIEW', 'household_records', 10, 'Viewed household: Stark', '::1', '2026-08-14 14:24:30'),
(153, 1, 'VIEW', 'household_records', 7, 'Viewed household: Maximoff', '::1', '2026-08-14 14:24:31'),
(154, 1, 'VIEW', 'household_records', 7, 'Viewed household: Maximoff', '::1', '2026-08-14 14:24:32'),
(155, 1, 'VIEW', 'household_records', 10, 'Viewed household: Stark', '::1', '2026-08-14 14:24:35'),
(156, 1, 'UPDATE', 'household_records', 10, 'Updated household: Stark with 2 members', '::1', '2026-08-14 14:24:48'),
(157, 1, 'VIEW', 'household_records', 10, 'Viewed household: Stark', '::1', '2026-08-14 14:24:50'),
(158, 1, 'VIEW', 'household_records', 7, 'Viewed household: Maximoff', '::1', '2026-08-14 14:24:53'),
(159, 1, 'UPDATE', 'household_records', 7, 'Updated household: Maximoff with 2 members', '::1', '2026-08-14 14:25:05'),
(160, 1, 'VIEW', 'household_records', 7, 'Viewed household: Maximoff', '::1', '2026-08-14 14:25:06'),
(161, 1, 'UPDATE', 'household_records', 6, 'Updated household: Romanoff with 2 members', '::1', '2026-08-14 14:25:26'),
(162, 1, 'VIEW', 'household_records', 6, 'Viewed household: Allianovna', '::1', '2026-08-14 14:25:28'),
(163, 1, 'CREATE', 'household_records', 12, 'Added household: Leeds with 2 members', '::1', '2026-08-14 14:31:02'),
(164, 1, 'VIEW', 'household_records', 12, 'Viewed household: Leeds', '::1', '2026-08-14 14:31:09'),
(165, 1, 'VIEW', 'household_records', 11, 'Viewed household: Rogers', '::1', '2026-08-14 14:32:58'),
(166, 1, 'UPDATE', 'household_records', 12, 'Updated household: Leeds with 2 members', '::1', '2026-08-14 14:33:42'),
(167, 1, 'VIEW', 'household_records', 12, 'Viewed household: Leeds', '::1', '2026-08-14 14:33:44'),
(168, 1, 'UPDATE', 'household_records', 12, 'Updated household: Leeds with 2 members', '::1', '2026-08-14 14:34:13'),
(169, 1, 'VIEW', 'household_records', 12, 'Viewed household: Leeds', '::1', '2026-08-14 14:34:15');

-- --------------------------------------------------------

--
-- Table structure for table `backups`
--

CREATE TABLE `backups` (
  `id` int(11) NOT NULL,
  `filename` varchar(255) DEFAULT NULL,
  `file_size` bigint(20) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `businesses`
--

CREATE TABLE `businesses` (
  `id` int(11) NOT NULL,
  `business_name` varchar(100) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `business_type` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `registration_date` date DEFAULT NULL,
  `permit_number` varchar(50) DEFAULT NULL,
  `status` enum('Active','Inactive','Pending') DEFAULT 'Active',
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `certificates`
--

CREATE TABLE `certificates` (
  `id` int(11) NOT NULL,
  `resident_id` int(11) DEFAULT NULL,
  `certificate_type` varchar(50) DEFAULT NULL,
  `certificate_number` varchar(50) DEFAULT NULL,
  `purpose` text DEFAULT NULL,
  `issued_date` date DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `status` enum('Pending','Issued','Expired','Cancelled') DEFAULT 'Pending',
  `issued_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `demographic_stats`
-- (See below for the actual view)
--
CREATE TABLE `demographic_stats` (
`total_population` bigint(21)
,`total_households` bigint(21)
,`total_male` bigint(21)
,`total_female` bigint(21)
,`birthday_today` bigint(21)
);

-- --------------------------------------------------------

--
-- Table structure for table `household_members`
--

CREATE TABLE `household_members` (
  `id` int(11) NOT NULL,
  `household_id` int(11) DEFAULT NULL,
  `member_id` int(11) DEFAULT NULL,
  `position` varchar(50) DEFAULT NULL,
  `is_head` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `household_members`
--

INSERT INTO `household_members` (`id`, `household_id`, `member_id`, `position`, `is_head`, `created_at`) VALUES
(1, 11, 9, 'Head of the Family', 1, '2026-08-14 14:24:23'),
(2, 11, 19, 'Member', 0, '2026-08-14 14:24:23'),
(3, 10, 12, 'Head of the Family', 1, '2026-08-14 14:24:48'),
(4, 10, 13, 'Member', 0, '2026-08-14 14:24:48'),
(5, 7, 10, 'Head of the Family', 1, '2026-08-14 14:25:05'),
(6, 7, 11, 'Member', 0, '2026-08-14 14:25:05'),
(7, 6, 8, 'Head of the Family', 1, '2026-08-14 14:25:26'),
(8, 6, 15, 'Member', 0, '2026-08-14 14:25:26'),
(13, 12, 21, 'Head of the Family', 1, '2026-08-14 14:34:13'),
(14, 12, 16, 'Member', 0, '2026-08-14 14:34:13');

-- --------------------------------------------------------

--
-- Table structure for table `household_records`
--

CREATE TABLE `household_records` (
  `id` int(11) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `ext_name` varchar(10) DEFAULT NULL,
  `place_of_birth` varchar(100) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `sex` enum('Male','Female','Other') NOT NULL,
  `civil_status` enum('Single','Married','Widowed','Divorced','Separated') NOT NULL,
  `citizenship` varchar(50) DEFAULT NULL,
  `occupation` varchar(100) DEFAULT NULL,
  `profession` varchar(100) DEFAULT NULL,
  `disability` text DEFAULT NULL,
  `pets` text DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `household_type` varchar(50) DEFAULT 'Nuclear',
  `dwelling_type` varchar(50) DEFAULT NULL,
  `household_name` varchar(100) DEFAULT NULL,
  `position_in_household` varchar(50) DEFAULT NULL,
  `tenure_status` varchar(50) DEFAULT 'Owner',
  `monthly_income` decimal(10,2) DEFAULT 0.00,
  `head_of_family_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `household_records`
--

INSERT INTO `household_records` (`id`, `last_name`, `first_name`, `middle_name`, `ext_name`, `place_of_birth`, `date_of_birth`, `age`, `sex`, `civil_status`, `citizenship`, `occupation`, `profession`, `disability`, `pets`, `profile_picture`, `created_by`, `created_at`, `updated_at`, `household_type`, `dwelling_type`, `household_name`, `position_in_household`, `tenure_status`, `monthly_income`, `head_of_family_id`) VALUES
(6, 'Allianovna', 'Natasha', 'R.', '', 'Valenzuela', '1988-02-09', 38, 'Female', 'Married', 'Filipino', 'Computer Science', 'Computer Science', '', '', '6a7ef97c89716.jpg', 1, '2026-08-14 11:18:20', '2026-08-14 12:12:31', 'Nuclear', 'Townhouse', 'Romanoff', 'Head of the Family', 'Owner', 300000.00, 8),
(7, 'Maximoff', 'Wanda', '', '', 'Manila', '1990-08-06', 36, 'Female', 'Widowed', 'Dual Citizen', 'Cookery', 'Cookery', '', '', '6a7efc6bdc7e6.jpg', 1, '2026-08-14 11:30:51', '2026-08-14 12:01:28', 'Extended', 'Townhouse', 'Maximoff', 'Head of the Family', 'Owner', 40000.00, 10),
(10, 'Stark', 'Tony', '', '', 'San Fransico', '1960-12-12', 65, 'Male', 'Married', 'Filipino', '', '', '', '', '6a7f03578e868.jpg', 1, '2026-08-14 11:59:59', '2026-08-14 12:20:08', 'Nuclear', 'Condominium', 'Stark', 'Head of the Family', 'Owner', 99999999.99, 12),
(11, 'Rogers', 'Steve', '', '', 'Quezon City', '1979-02-08', 47, 'Male', 'Married', 'Dual Citizen', 'Army', 'Army', '', '', '6a7f1e4c61040.jpg', 1, '2026-08-14 13:55:24', '2026-08-14 14:06:57', 'Nuclear', 'Single Family House', 'Rogers', 'Head of the Family', 'Renter', 80000.00, 9),
(12, 'Leeds', 'Ned', 'M', 'Jr', 'Tandang Sora', '2007-08-12', 19, 'Male', 'Single', 'Filipino', '', '', '', '', '6a7f2765f071c.jpg', 1, '2026-08-14 14:31:02', '2026-08-14 14:34:13', 'Dorm', 'Townhouse', 'Leeds', 'Head of the Family', 'Owner', 10000.00, 21);

-- --------------------------------------------------------

--
-- Table structure for table `individual_records`
--

CREATE TABLE `individual_records` (
  `id` int(11) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `ext_name` varchar(10) DEFAULT NULL,
  `place_of_birth` varchar(100) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `sex` enum('Male','Female','Other') NOT NULL,
  `civil_status` enum('Single','Married','Widowed','Divorced','Separated') NOT NULL,
  `highest_education` enum('Elementary','High School','Vocational','College','Post Graduate','Doctorate') DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `educational_status` varchar(50) DEFAULT NULL,
  `philsys_number` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `mobile_number` varchar(20) DEFAULT NULL,
  `telephone_number` varchar(20) DEFAULT NULL,
  `region` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `city_municipality` varchar(100) DEFAULT NULL,
  `barangay_address` varchar(100) DEFAULT NULL,
  `house_address` varchar(100) DEFAULT NULL,
  `street` varchar(100) DEFAULT NULL,
  `subdivision` varchar(100) DEFAULT NULL,
  `zip_code` varchar(10) DEFAULT NULL,
  `blood_type` varchar(10) DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `height` varchar(50) DEFAULT NULL,
  `citizenship` varchar(50) DEFAULT NULL,
  `registered_voter` tinyint(1) DEFAULT 0,
  `voter_not_resident` tinyint(1) DEFAULT 0,
  `ethnicity` varchar(50) DEFAULT NULL,
  `position_in_household` varchar(50) DEFAULT NULL,
  `mother_maiden_name` varchar(100) DEFAULT NULL,
  `has_pet` tinyint(1) DEFAULT 0,
  `sectors` text DEFAULT NULL,
  `sector_other` varchar(100) DEFAULT NULL,
  `profession` varchar(100) DEFAULT NULL,
  `complexion` varchar(50) DEFAULT NULL,
  `religion` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `individual_records`
--

INSERT INTO `individual_records` (`id`, `last_name`, `first_name`, `middle_name`, `ext_name`, `place_of_birth`, `date_of_birth`, `age`, `sex`, `civil_status`, `highest_education`, `profile_picture`, `created_by`, `created_at`, `updated_at`, `educational_status`, `philsys_number`, `email`, `mobile_number`, `telephone_number`, `region`, `province`, `city_municipality`, `barangay_address`, `house_address`, `street`, `subdivision`, `zip_code`, `blood_type`, `weight`, `height`, `citizenship`, `registered_voter`, `voter_not_resident`, `ethnicity`, `position_in_household`, `mother_maiden_name`, `has_pet`, `sectors`, `sector_other`, `profession`, `complexion`, `religion`) VALUES
(8, 'Allianovna', 'Natasha', 'R.', '', 'Valenzuela', '1988-02-09', 38, 'Female', 'Married', 'Post Graduate', '6a7ef5ef7c6b7.jpg', 1, '2026-08-14 11:03:11', '2026-08-14 11:16:53', 'Graduate', '123123123123123', 'nataliaallianovna@gmail.com', '09309764879', '09309764879', 'NCR', 'Manila', 'Quezon City', 'Nayong Kanluran', '13R', 'Don Antonio', 'San Felipe 4 Compound', '1104', 'A+', 60.00, '5\'6', 'Filipino', 1, 0, 'Cebuano', 'Head of the Family', 'Romanoff', 0, 'Employed', '', 'Computer Science', NULL, NULL),
(9, 'Rogers', 'Steve', '', '', 'Quezon City', '1979-02-08', 47, 'Male', 'Married', 'College', '6a7efa5b2425b.jpg', 1, '2026-08-14 11:22:03', '2026-08-14 13:57:15', 'Graduate', '1233123312231233', 'steverogers@gmail.com', '09678482671', '09678482671', 'NCR', 'Manila', 'Quezon City', 'Nayong Kanluran', '19A Brooklyn', 'San Bartolome', 'Realstate Village', '1104', 'A+', 80.00, '6\'3', 'Dual Citizen', 1, 0, 'Tagalog', 'Head of the Family', 'Rogers', 0, 'Unemployed', '', 'Army', NULL, NULL),
(10, 'Maximoff', 'Wanda', '', '', 'Manila', '1990-08-06', 36, 'Female', 'Widowed', 'College', '6a7efb8d210f6.jpg', 1, '2026-08-14 11:27:09', '2026-08-14 11:27:09', 'Graduate', '1234123412341234', 'wandamaximoff@gmail.com', '09863871390', '09863871390', 'NCR', 'Manila', 'Quezon City', 'Nayong Kanluran', '141D San Antonio', 'Republic St', 'Caroline Village', '1104', 'AB+', 60.00, '5\'8', 'Dual Citizen', 0, 1, 'Cebuano', 'Head of the Family', 'Maximoff', 0, 'Unemployed', '', 'Cookery', NULL, NULL),
(11, 'Maximoff', 'Pietro', '', '', 'Manila', '1990-02-08', 36, 'Male', 'Single', 'College', '6a7efc24ac37d.jpg', 1, '2026-08-14 11:29:40', '2026-08-14 11:29:40', 'Graduate', '1234123412341234', 'pietromaximoff@gmail.com', '09123267890', '09123267890', 'NCR', 'Manila', 'Quezon City', 'Nayong Kanluran', '141D San Antonio', 'San Bartolome', 'Realstate Village', '1104', 'AB+', 70.00, '6\'1', 'Dual Citizen', 0, 1, 'Cebuano', 'Sibling', 'Maximoff', 0, 'Unemployed', '', 'IT', NULL, NULL),
(12, 'Stark', 'Tony', '', '', 'San Fransico', '1960-12-12', 65, 'Male', 'Married', 'Doctorate', '6a7f037612d41.jpg', 1, '2026-08-14 11:51:19', '2026-08-14 12:00:54', 'Graduate', '1234123412341234', 'tonystark@gmail.com', '08798767482', '08798767482', 'NCR', 'Manila', 'Quezon City', 'Nayong Kanluran', '141D San Antonio', 'San James', 'MPLACE', '1104', 'O+', 60.00, '6\'1', 'Filipino', 1, 0, 'Tagalog', 'Head of the Family', 'Stark', 0, 'Employed', '', '', '', 'Catholic'),
(13, 'Stark', 'Pepper', 'Potts', '', 'San Fransico', '1980-12-12', 45, 'Female', 'Married', 'Post Graduate', '6a7f036cc0af9.jpg', 1, '2026-08-14 11:53:25', '2026-08-14 12:00:44', 'Graduate', '1234123412341234', 'pepperpotts@gmail.com', '09786781234', '09786781234', 'NCR', 'Manila', 'Quezon City', 'Nayong Kanluran', '19A Brooklyn', 'San James', 'MPLACE', '1104', 'O-', 60.00, '5\'8', 'Filipino', 1, 0, 'Tagalog', 'Mother', 'Potts', 0, 'Employed', '', '', '', 'Catholic'),
(14, 'Banner', 'Bruce', '', '', 'Bataan', '1970-06-02', 56, 'Male', 'Single', 'Post Graduate', '6a7f046528711.jpg', 1, '2026-08-14 12:04:53', '2026-08-14 12:05:48', 'Graduate', '1234123412341234', 'brucebanner@gmail.com', '09784671829', '09784671829', 'NCR', 'Manila', 'Quezon City', 'Nayong Kanluran', '11D Brune', 'Mary', 'Realstate Village', '1104', 'Unknown', 60.00, '5\'8', 'Filipino', 1, 0, 'Bicolano', 'Head of the Family', 'Banner', 0, 'Employed', '', '', '', 'Catholic'),
(15, 'Belova', 'Yelena', '', '', 'Caloocan', '1993-12-12', 32, 'Female', 'Single', 'Vocational', '6a7f05d9bc29d.jpg', 1, '2026-08-14 12:11:05', '2026-08-14 12:11:16', 'Graduate', '1234123412341234', 'yelenabelova@gmail.com', '09182783467', '09182783467', 'NCR', 'Manila', 'Quezon City', 'Nayong Kanluran', '13R', 'Don Antonio', 'San Felipe 4 Compound', '1104', 'A-', 66.00, '5\'5', 'Filipino', 1, 0, 'Cebuano', 'Half-Sibling', 'Belova', 0, 'Unemployed', '', '', '', 'Iglesia ni Cristo'),
(16, 'Parker', 'Peter', 'Ben', '', 'Dagupan', '2004-03-12', 22, 'Male', 'Single', 'Vocational', '6a7f0a8c280fd.png', 1, '2026-08-14 12:31:08', '2026-08-14 12:31:08', 'Graduate', '1234123412341234', 'peterparker@gmail.com', '09187289487', '09187289487', 'NCR', 'Manila', 'Quezon City', 'Nayong Kanluran', '14D Block', 'Brooklen St', 'Parkway Village', '1104', 'AB+', 40.00, '5\'5', 'Dual Citizen', 1, 0, 'Hiligaynon', 'Son', 'Ben', 0, 'Unemployed,Out of School Youth (OSY)', '', '', '', 'Christian'),
(17, 'Strange', 'Steven', 'D', '', 'Caloocan', '1986-07-12', 40, 'Male', 'Single', 'Post Graduate', '6a7f0b3310787.jpg', 1, '2026-08-14 12:33:55', '2026-08-14 12:33:55', 'Masters', '1234123412341234', 'stevenstrange@gmail.com', '09173829874', '09173829874', 'NCR', 'Manila', 'Quezon City', 'Nayong Kanluran', '14C', 'Bleecker St', 'Junction Village', '1104', 'O+', 60.00, '6\'2', 'Filipino', 1, 0, 'Waray', 'Head of the Family', 'Strange', 0, 'Employed', '', '', '', 'Iglesia ni Cristo'),
(19, 'Carter', 'Peggy', 'M', '', 'Cavite', '1980-03-06', 46, 'Female', 'Married', 'College', '6a7f1dcc423d4.jpg', 1, '2026-08-14 13:53:16', '2026-08-14 13:57:01', 'Graduate', '1234123412341234', 'peggycarter@gmail.com', '0978478367', '0978478367', 'NCR', 'Manila', 'Quezon City', 'Nayong Kanluran', '19A Brooklyn', 'San Bartolome', 'Realstate Village', '1104', 'O-', 40.00, '5\'8', 'Dual Citizen', 1, 0, 'Ivatan', 'Spouse', 'Margarret', 0, 'Employed', '', '', '', 'Roman Catholic'),
(20, 'Barton', 'Clint', 'Third', '', 'Bulacan', '1980-10-23', 45, 'Male', 'Married', 'College', '6a7f1fec2a0a7.jpg', 1, '2026-08-14 14:02:20', '2026-08-14 14:02:20', 'Graduate', '1234123412341234', 'clintbarton@gmail.com', '09123467890', '09123467890', 'NCR', 'Manila', 'Quezon City', 'Nayong Kanluran', '23B', 'NAIA St', 'Parkway Village', '1104', 'A-', 69.00, '6\'2', 'Filipino', 1, 0, 'Cebuano', 'Father', 'Barton', 0, 'Employed', '', '', '', 'Roman Catholic'),
(21, 'Leeds', 'Ned', 'M', 'Jr', 'Tandang Sora', '2007-08-12', 19, 'Male', 'Single', 'Vocational', '6a7f2645bb8e7.jpg', 1, '2026-08-14 14:29:25', '2026-08-14 14:29:25', 'Undergraduate', '1234123412341234', 'nedleeds@gmail.com', '09871234378', '09871234378', 'NCR', 'Manila', 'Quezon City', 'Nayong Kanluran', '23', 'Mapanglait St.', 'San Pedro Compound', '1104', '', NULL, '', 'Filipino', 1, 0, 'Tagalog', 'Son', 'Manlait', 0, 'Student', '', '', '', 'Christianity');

-- --------------------------------------------------------

--
-- Table structure for table `pets`
--

CREATE TABLE `pets` (
  `id` int(11) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `pet_name` varchar(100) NOT NULL,
  `pet_type` varchar(50) NOT NULL,
  `breed` varchar(100) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `gender` enum('Male','Female') DEFAULT 'Male',
  `weight` decimal(5,2) DEFAULT NULL,
  `microchip_number` varchar(50) DEFAULT NULL,
  `vaccination_status` enum('Up to Date','Partial','None') DEFAULT 'None',
  `registration_date` date DEFAULT NULL,
  `status` enum('Active','Inactive','Deceased') DEFAULT 'Active',
  `pet_photo` varchar(255) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pets`
--

INSERT INTO `pets` (`id`, `owner_id`, `pet_name`, `pet_type`, `breed`, `color`, `gender`, `weight`, `microchip_number`, `vaccination_status`, `registration_date`, `status`, `pet_photo`, `created_by`, `created_at`) VALUES
(2, 10, 'Bailey', 'Dog', 'Labrador', 'Light brown', 'Male', 40.00, '12341234', 'Up to Date', '2026-12-12', 'Active', '6a7f0e4696e4f.jpg', 1, '2026-08-14 12:47:02');

-- --------------------------------------------------------

--
-- Table structure for table `sql_query_log`
--

CREATE TABLE `sql_query_log` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `query` text DEFAULT NULL,
  `query_type` varchar(20) DEFAULT NULL,
  `affected_rows` int(11) DEFAULT NULL,
  `query_time` decimal(10,3) DEFAULT NULL,
  `executed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  `last_login` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `full_name`, `email`, `role_id`, `last_login`, `is_active`, `created_at`) VALUES
(1, 'superadmin', 'admin123', 'Super Administrator', 'superadmin@barangay.gov.ph', 1, '2026-08-14 10:44:36', 1, '2026-07-25 09:54:26'),
(2, 'admin', 'admin123', 'System Administrator', 'admin@barangay.gov.ph', 2, '2026-07-25 12:03:55', 1, '2026-07-25 09:54:26'),
(3, 'enumerator', 'admin123', 'Field Enumerator', 'enumerator@barangay.gov.ph', 3, '2026-07-25 12:04:17', 1, '2026-07-25 09:54:26'),
(4, 'editor', 'admin123', 'Data Editor', 'editor@barangay.gov.ph', 4, '2026-07-25 12:04:03', 1, '2026-07-25 09:54:26');

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `id` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL,
  `role_description` text DEFAULT NULL,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`permissions`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`id`, `role_name`, `role_description`, `permissions`, `created_at`) VALUES
(1, 'superadmin', 'Full system access with SQL execution capabilities', '{\r\n    \"dashboard\": [\"view\"],\r\n    \"inhabitants\": [\"view\", \"add\", \"edit\", \"delete\"],\r\n    \"demographic\": [\"view\"],\r\n    \"certification\": [\"view\", \"add\", \"edit\", \"delete\"],\r\n    \"extras\": [\"view\", \"add\", \"edit\", \"delete\"],\r\n    \"reports\": [\"view\", \"generate\"],\r\n    \"system\": [\"view\", \"manage\", \"sql_execute\"]\r\n}', '2026-07-25 09:54:26'),
(2, 'admin', 'Management level with limited system access', '{\r\n    \"dashboard\": [\"view\"],\r\n    \"inhabitants\": [\"view\", \"add\", \"edit\", \"delete\"],\r\n    \"demographic\": [\"view\"],\r\n    \"certification\": [\"view\", \"add\", \"edit\", \"delete\"],\r\n    \"extras\": [\"view\", \"add\", \"edit\", \"delete\"],\r\n    \"reports\": [\"view\", \"generate\"],\r\n    \"system\": [\"view_users\"]\r\n}', '2026-07-25 09:54:26'),
(3, 'enumerator', 'Field data collection and certification', '{\r\n    \"dashboard\": [\"view\"],\r\n    \"inhabitants\": [\"view\", \"add\", \"edit\"],\r\n    \"demographic\": [\"view\"],\r\n    \"certification\": [\"view\", \"add\"]\r\n}', '2026-07-25 09:54:26'),
(4, 'editor', 'Data management with reporting capabilities', '{\r\n    \"dashboard\": [\"view\"],\r\n    \"inhabitants\": [\"view\", \"add\", \"edit\", \"delete\"],\r\n    \"demographic\": [\"view\", \"add\", \"edit\", \"delete\"],\r\n    \"certification\": [\"view\", \"add\", \"edit\", \"delete\"],\r\n    \"extras\": [\"view\", \"add\", \"edit\", \"delete\"],\r\n    \"reports\": [\"view\", \"generate\"]\r\n}', '2026-07-25 09:54:26');

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `id` int(11) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `plate_number` varchar(20) DEFAULT NULL,
  `vehicle_type` varchar(50) DEFAULT NULL,
  `brand` varchar(50) DEFAULT NULL,
  `model` varchar(50) DEFAULT NULL,
  `color` varchar(30) DEFAULT NULL,
  `year_model` int(11) DEFAULT NULL,
  `registration_date` date DEFAULT NULL,
  `status` enum('Active','Inactive','Expired') DEFAULT 'Active',
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure for view `age_distribution`
--
DROP TABLE IF EXISTS `age_distribution`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `age_distribution`  AS SELECT CASE WHEN `individual_records`.`age` <= 17 THEN '0-17' WHEN `individual_records`.`age` <= 25 THEN '18-25' WHEN `individual_records`.`age` <= 35 THEN '26-35' WHEN `individual_records`.`age` <= 45 THEN '36-45' WHEN `individual_records`.`age` <= 55 THEN '46-55' WHEN `individual_records`.`age` <= 65 THEN '56-65' ELSE '65+' END AS `age_group`, count(0) AS `count` FROM `individual_records` WHERE `individual_records`.`age` is not null GROUP BY CASE WHEN `individual_records`.`age` <= 17 THEN '0-17' WHEN `individual_records`.`age` <= 25 THEN '18-25' WHEN `individual_records`.`age` <= 35 THEN '26-35' WHEN `individual_records`.`age` <= 45 THEN '36-45' WHEN `individual_records`.`age` <= 55 THEN '46-55' WHEN `individual_records`.`age` <= 65 THEN '56-65' ELSE '65+' END ;

-- --------------------------------------------------------

--
-- Structure for view `demographic_stats`
--
DROP TABLE IF EXISTS `demographic_stats`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `demographic_stats`  AS SELECT (select count(0) from `individual_records`) AS `total_population`, (select count(0) from `household_records`) AS `total_households`, (select count(0) from `individual_records` where `individual_records`.`sex` = 'Male') AS `total_male`, (select count(0) from `individual_records` where `individual_records`.`sex` = 'Female') AS `total_female`, (select count(0) from `individual_records` where date_format(`individual_records`.`date_of_birth`,'%m-%d') = date_format(curdate(),'%m-%d')) AS `birthday_today` ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `audit_trails`
--
ALTER TABLE `audit_trails`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_action` (`action`),
  ADD KEY `idx_table_name` (`table_name`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_record_id` (`record_id`);

--
-- Indexes for table `backups`
--
ALTER TABLE `backups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `businesses`
--
ALTER TABLE `businesses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permit_number` (`permit_number`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_owner_id` (`owner_id`),
  ADD KEY `idx_business_type` (`business_type`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `certificates`
--
ALTER TABLE `certificates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `certificate_number` (`certificate_number`),
  ADD KEY `issued_by` (`issued_by`),
  ADD KEY `idx_resident_id` (`resident_id`),
  ADD KEY `idx_certificate_type` (`certificate_type`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_issued_date` (`issued_date`);

--
-- Indexes for table `household_members`
--
ALTER TABLE `household_members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `household_id` (`household_id`),
  ADD KEY `member_id` (`member_id`);

--
-- Indexes for table `household_records`
--
ALTER TABLE `household_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_last_name` (`last_name`),
  ADD KEY `idx_first_name` (`first_name`),
  ADD KEY `idx_sex` (`sex`),
  ADD KEY `idx_civil_status` (`civil_status`),
  ADD KEY `idx_citizenship` (`citizenship`),
  ADD KEY `idx_occupation` (`occupation`),
  ADD KEY `idx_age` (`age`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_name_search` (`last_name`,`first_name`,`middle_name`);

--
-- Indexes for table `individual_records`
--
ALTER TABLE `individual_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_last_name` (`last_name`),
  ADD KEY `idx_first_name` (`first_name`),
  ADD KEY `idx_sex` (`sex`),
  ADD KEY `idx_civil_status` (`civil_status`),
  ADD KEY `idx_education` (`highest_education`),
  ADD KEY `idx_age` (`age`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_name_search` (`last_name`,`first_name`,`middle_name`);

--
-- Indexes for table `pets`
--
ALTER TABLE `pets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_pet_type` (`pet_type`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_owner_id` (`owner_id`),
  ADD KEY `idx_pet_name` (`pet_name`);

--
-- Indexes for table `sql_query_log`
--
ALTER TABLE `sql_query_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_username` (`username`),
  ADD KEY `idx_role_id` (`role_id`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `plate_number` (`plate_number`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_owner_id` (`owner_id`),
  ADD KEY `idx_plate_number` (`plate_number`),
  ADD KEY `idx_status` (`status`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `audit_trails`
--
ALTER TABLE `audit_trails`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=170;

--
-- AUTO_INCREMENT for table `backups`
--
ALTER TABLE `backups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `businesses`
--
ALTER TABLE `businesses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `certificates`
--
ALTER TABLE `certificates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `household_members`
--
ALTER TABLE `household_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `household_records`
--
ALTER TABLE `household_records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `individual_records`
--
ALTER TABLE `individual_records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `pets`
--
ALTER TABLE `pets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `sql_query_log`
--
ALTER TABLE `sql_query_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `user_roles`
--
ALTER TABLE `user_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `audit_trails`
--
ALTER TABLE `audit_trails`
  ADD CONSTRAINT `audit_trails_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `backups`
--
ALTER TABLE `backups`
  ADD CONSTRAINT `backups_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `businesses`
--
ALTER TABLE `businesses`
  ADD CONSTRAINT `businesses_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `household_records` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `businesses_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `certificates`
--
ALTER TABLE `certificates`
  ADD CONSTRAINT `certificates_ibfk_1` FOREIGN KEY (`resident_id`) REFERENCES `individual_records` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `certificates_ibfk_2` FOREIGN KEY (`issued_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `household_members`
--
ALTER TABLE `household_members`
  ADD CONSTRAINT `household_members_ibfk_1` FOREIGN KEY (`household_id`) REFERENCES `household_records` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `household_members_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `individual_records` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `household_records`
--
ALTER TABLE `household_records`
  ADD CONSTRAINT `household_records_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `individual_records`
--
ALTER TABLE `individual_records`
  ADD CONSTRAINT `individual_records_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `pets`
--
ALTER TABLE `pets`
  ADD CONSTRAINT `pets_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `household_records` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `pets_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `sql_query_log`
--
ALTER TABLE `sql_query_log`
  ADD CONSTRAINT `sql_query_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `user_roles` (`id`);

--
-- Constraints for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD CONSTRAINT `vehicles_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `household_records` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `vehicles_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
ALTER TABLE individual_records
ADD COLUMN gender VARCHAR(50) NULL AFTER sex;