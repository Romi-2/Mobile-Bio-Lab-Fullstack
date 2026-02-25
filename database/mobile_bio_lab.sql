-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for mobile_bio_lab
CREATE DATABASE IF NOT EXISTS `mobile_bio_lab` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `mobile_bio_lab`;

-- Dumping structure for table mobile_bio_lab.available_slots
CREATE TABLE IF NOT EXISTS `available_slots` (
  `id` int NOT NULL AUTO_INCREMENT,
  `city` varchar(100) NOT NULL,
  `date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `isBooked` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `available_seats` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table mobile_bio_lab.available_slots: ~40 rows (approximately)
DELETE FROM `available_slots`;
INSERT INTO `available_slots` (`id`, `city`, `date`, `start_time`, `end_time`, `isBooked`, `created_at`, `updated_at`, `available_seats`) VALUES
	(9, 'Lahore', '2026-03-07', '08:00:00', '09:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:08:38', 10),
	(10, 'Lahore', '2026-03-07', '10:00:00', '11:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 09:13:42', 9),
	(11, 'Lahore', '2026-03-07', '12:00:00', '13:30:00', 1, '2025-10-02 10:17:28', '2026-02-25 07:31:51', 9),
	(12, 'Lahore', '2026-03-07', '14:00:00', '15:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:05:00', 10),
	(13, 'Lahore', '2026-03-07', '16:00:00', '17:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:08:46', 10),
	(14, 'Lahore', '2026-03-08', '08:00:00', '09:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:06:10', 10),
	(15, 'Lahore', '2026-03-08', '10:00:00', '11:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:08:49', 10),
	(16, 'Lahore', '2026-03-08', '12:00:00', '13:30:00', 1, '2025-10-02 10:17:28', '2026-02-25 07:31:55', 9),
	(17, 'Lahore', '2026-03-08', '14:00:00', '15:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:08:51', 10),
	(18, 'Lahore', '2026-03-08', '16:00:00', '17:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:06:19', 10),
	(19, 'Islamabad', '2026-03-09', '08:00:00', '09:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:06:32', 10),
	(20, 'Islamabad', '2026-03-09', '10:00:00', '11:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:06:33', 10),
	(21, 'Islamabad', '2026-03-09', '12:00:00', '13:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 09:19:35', 9),
	(22, 'Islamabad', '2026-03-09', '14:00:00', '15:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:06:37', 10),
	(23, 'Islamabad', '2026-03-09', '16:00:00', '17:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:06:43', 10),
	(24, 'Islamabad', '2026-03-10', '08:00:00', '09:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:06:53', 10),
	(25, 'Islamabad', '2026-03-10', '10:00:00', '11:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:06:55', 10),
	(26, 'Islamabad', '2026-03-10', '12:00:00', '13:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:08:56', 10),
	(27, 'Islamabad', '2026-03-10', '14:00:00', '15:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:06:58', 10),
	(28, 'Islamabad', '2026-03-10', '16:00:00', '17:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:07:02', 10),
	(29, 'Peshawar', '2026-03-11', '08:00:00', '09:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:07:11', 10),
	(30, 'Peshawar', '2026-03-11', '10:00:00', '11:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:07:13', 10),
	(31, 'Peshawar', '2026-03-11', '12:00:00', '13:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:07:14', 10),
	(32, 'Peshawar', '2026-03-11', '14:00:00', '15:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:07:16', 10),
	(33, 'Peshawar', '2026-03-11', '16:00:00', '17:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:07:20', 10),
	(34, 'Peshawar', '2026-03-12', '08:00:00', '09:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:07:40', 10),
	(35, 'Peshawar', '2026-03-12', '10:00:00', '11:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:07:42', 10),
	(36, 'Peshawar', '2026-03-12', '12:00:00', '13:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:07:46', 10),
	(37, 'Peshawar', '2026-03-12', '14:00:00', '15:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:10:41', 10),
	(38, 'Peshawar', '2026-03-12', '16:00:00', '17:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:07:50', 10),
	(39, 'Quetta', '2026-03-13', '08:00:00', '09:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:07:58', 10),
	(40, 'Quetta', '2026-03-13', '10:00:00', '11:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:08:00', 10),
	(41, 'Quetta', '2026-03-13', '12:00:00', '13:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:08:59', 10),
	(42, 'Quetta', '2026-03-13', '14:00:00', '15:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:08:05', 10),
	(43, 'Quetta', '2026-03-13', '16:00:00', '17:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:08:07', 10),
	(44, 'Quetta', '2026-03-14', '08:00:00', '09:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:08:16', 10),
	(45, 'Quetta', '2026-03-14', '10:00:00', '11:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:08:18', 10),
	(46, 'Quetta', '2026-03-14', '12:00:00', '13:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:10:04', 10),
	(47, 'Quetta', '2026-03-14', '14:00:00', '15:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:08:21', 10),
	(48, 'Quetta', '2026-03-14', '16:00:00', '17:30:00', 0, '2025-10-02 10:17:28', '2026-02-25 07:08:26', 10);

-- Dumping structure for table mobile_bio_lab.notifications
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table mobile_bio_lab.notifications: ~0 rows (approximately)
DELETE FROM `notifications`;

-- Dumping structure for table mobile_bio_lab.protocols
CREATE TABLE IF NOT EXISTS `protocols` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `category` varchar(100) NOT NULL,
  `steps` json NOT NULL,
  `created_by` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `protocols_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table mobile_bio_lab.protocols: ~1 rows (approximately)
DELETE FROM `protocols`;
INSERT INTO `protocols` (`id`, `title`, `description`, `category`, `steps`, `created_by`, `created_at`, `updated_at`) VALUES
	(9, ' PCR Amplification of DNA  ', 'Procedure to amplify a target DNA fragment using Taq polymerase. ', 'Molecular Biology ', '[{"title": "Reaction Setup", "duration": "15 minutes", "equipment": ["Micropipettes", "PCR tubes", "ice box"], "stepNumber": 1, "description": "Mix DNA template, primers, dNTPs, buffer, and Taq polymerase on ice.", "precautions": ["Use sterile tips and change them frequently."]}]', 23, '2025-10-17 06:33:51', '2025-10-17 07:23:18');

-- Dumping structure for table mobile_bio_lab.refresh_tokens
CREATE TABLE IF NOT EXISTS `refresh_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `token` varchar(500) NOT NULL,
  `expiry` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=148 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table mobile_bio_lab.refresh_tokens: ~123 rows (approximately)
DELETE FROM `refresh_tokens`;
INSERT INTO `refresh_tokens` (`id`, `userId`, `token`, `expiry`) VALUES
	(1, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzI4MjMyNiwiZXhwIjoxNzYzODg3MTI2fQ.ngM-EknKbpIpJR3LRZVNY4dKUQve2gsGv32dvRaiCjE', '2025-11-23 13:38:46'),
	(2, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzI4NDI1NSwiZXhwIjoxNzYzODg5MDU1fQ.8kkaberjnFIj0t1KH1J1fER5NIvjnZ35BGtQckuR6M8', '2025-11-23 14:10:55'),
	(3, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzI4NDM3OSwiZXhwIjoxNzYzODg5MTc5fQ.-68L67oZ5TMlhMKkMKIEKXnAGYjrUf3PRPgWq7xnrKw', '2025-11-23 14:12:59'),
	(4, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzI4NTI3OSwiZXhwIjoxNzYzODkwMDc5fQ.gMOYqLb7cLZU21apVwQ37Mt4HSO9d4yav8CS41MJoF4', '2025-11-23 14:27:59'),
	(5, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzI4NjE5MSwiZXhwIjoxNzYzODkwOTkxfQ.HJokgez8FNOx-jYDwcnDGlLohA16VqGSC6NbuCJi3xA', '2025-11-23 14:43:11'),
	(6, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzI4NjM0OSwiZXhwIjoxNzYzODkxMTQ5fQ.0-LXjco0l1mVH3YuETlmeUL_mi4wb6cmfHivBAG4--Q', '2025-11-23 14:45:49'),
	(7, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzI4Njk5NiwiZXhwIjoxNzYzODkxNzk2fQ.O6qf0dg_I7LK83mFW_Zm7kCyANtvjlyKl4s66hYE7aY', '2025-11-23 14:56:36'),
	(8, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzI4NzAwNSwiZXhwIjoxNzYzODkxODA1fQ.5ffsWOZemLWsc6X_AtkyvfPL0Aks1ka7ie-Huz21MiY', '2025-11-23 14:56:45'),
	(9, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzI4NzAyNCwiZXhwIjoxNzYzODkxODI0fQ.gVzMz6vy3qodS5TOFlPpetRH1aZxKO2jzvCpTsWarmM', '2025-11-23 14:57:04'),
	(10, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzI4NzM5NCwiZXhwIjoxNzYzODkyMTk0fQ.BGlGINbGoLbmC5b5gvlnNabvNNbH9DbGKk-5vEH-b8A', '2025-11-23 15:03:14'),
	(11, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzI4NzQwNSwiZXhwIjoxNzYzODkyMjA1fQ.4jcmJA3ECgIsLirwEa4TRg9OrWEoyiUyrEv51xyi-D8', '2025-11-23 15:03:25'),
	(14, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzI4ODQxNCwiZXhwIjoxNzYzODkzMjE0fQ.4XVdW0RojkAYL2b9Y9AdsgnZ44T6PTIMElnEYQaGTig', '2025-11-23 15:20:14'),
	(15, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzI4ODQ1NCwiZXhwIjoxNzYzODkzMjU0fQ.QJjT6GKrF7GlgiUdYsSByldOXZxWhZ4VVK1M-5mIxzE', '2025-11-23 15:20:54'),
	(19, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzM1NjMxNiwiZXhwIjoxNzYzOTYxMTE2fQ.8Nv5ZIsM5Egq4MbWF8RtN5IPyQ2aEFvWwC7h78YVF-A', '2025-11-24 10:11:56'),
	(21, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzM1ODY3MywiZXhwIjoxNzYzOTYzNDczfQ.Lm_Jw5YjsjTO1MU9HjjRdCr35L3mbgjMbocPU-BZo9k', '2025-11-24 10:51:13'),
	(23, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzM1OTMzMCwiZXhwIjoxNzYzOTY0MTMwfQ.VsiBxsGs2M-B4r5LGjpOVySJoAXsEcXdh1ZTIJqx8VM', '2025-11-24 11:02:10'),
	(24, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzM1OTU4MywiZXhwIjoxNzYzOTY0MzgzfQ.iC7256qaAYCUIL8B_BZm98S7ctSgwVY6zWRRHPTte2k', '2025-11-24 11:06:23'),
	(25, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzM1OTU5MiwiZXhwIjoxNzYzOTY0MzkyfQ.msj1oYP8r5eRcLwFhfXYhF0gdkac0Vz_gvSFucOM-Qk', '2025-11-24 11:06:32'),
	(31, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzM2NjkwMywiZXhwIjoxNzYzOTcxNzAzfQ.G8JmPBQFSdqpq5hyoCsCkBDd9e8ZCHussA9uRQwPDxo', '2025-11-24 13:08:23'),
	(32, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzM2NzEyMCwiZXhwIjoxNzYzOTcxOTIwfQ.kIpadPf6qUIFdgeXBEr6Lj1YmrcbHI8YZImtnBW11j8', '2025-11-24 13:12:00'),
	(33, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzM2ODYwOSwiZXhwIjoxNzYzOTczNDA5fQ.QDPmZR_qC2TnCgL8rrItvCeQ0Ndr6qE3XElBGus-k7w', '2025-11-24 13:36:49'),
	(34, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzM2OTc3MCwiZXhwIjoxNzYzOTc0NTcwfQ.0OMdv4IxAHIWg32B5ikEuQ-S5rhxFKfIrC0Mujs1yO0', '2025-11-24 13:56:10'),
	(35, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzM2OTkyMCwiZXhwIjoxNzYzOTc0NzIwfQ.i-bqZOUhx2KxCQ2j9rhFUp5kRhmGhBFiQF2KP568zto', '2025-11-24 13:58:40'),
	(36, 36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImlhdCI6MTc2MzM3MDIwOCwiZXhwIjoxNzYzOTc1MDA4fQ.GBTgsDb1OSdB6otqAL-2j30c_r1oi2SLvRCe1_cSYE8', '2025-11-24 14:03:28'),
	(37, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzM3MDM0OSwiZXhwIjoxNzYzOTc1MTQ5fQ.OwEAprzXhBwy1oMi25YQU0-ByKhO18jghm6lJJCivJY', '2025-11-24 14:05:49'),
	(38, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzM3MDM5OCwiZXhwIjoxNzYzOTc1MTk4fQ.o0wvD6PnSdjO0CLwtQ70_RvucU8ElJAR5mLgTiXXk74', '2025-11-24 14:06:38'),
	(39, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzM3MDQ1NywiZXhwIjoxNzYzOTc1MjU3fQ.hfhOkPQqMsjlHqrrg_fKwAIJASL6KPQK-hbhv74c240', '2025-11-24 14:07:37'),
	(40, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzM3MTk5MCwiZXhwIjoxNzYzOTc2NzkwfQ.DFVA_uVErOVLzPluEF_RplmctcJp7wQxG5d5ze410g4', '2025-11-24 14:33:10'),
	(41, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzM3MjEzNSwiZXhwIjoxNzYzOTc2OTM1fQ.hxGWKmXsFDdsJb-43401sISnpUfhqTo08haCKo55LyQ', '2025-11-24 14:35:35'),
	(42, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzM3MjE2OCwiZXhwIjoxNzYzOTc2OTY4fQ.5vOIwYMG3pzXUSis5qiHW8z_dEkUZddIO9IFCp7GxEQ', '2025-11-24 14:36:08'),
	(43, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzM3MjIwMSwiZXhwIjoxNzYzOTc3MDAxfQ.DEldapHxNzuw1EN-Omr0iy-qdtiPg0V2TG3QfqEaKjI', '2025-11-24 14:36:41'),
	(45, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzM3MjU3NywiZXhwIjoxNzYzOTc3Mzc3fQ.pSeM82YPl-NZORPFMS2KDa4JxPBXlLAH8fl_AnryaxY', '2025-11-24 14:42:57'),
	(46, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ0NjQxNCwiZXhwIjoxNzY0MDUxMjE0fQ.IWxQZlUZ57zAMpjkQIAwAPdIJrYYWJ61m3I33I3FPAA', '2025-11-25 11:13:34'),
	(47, 36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImlhdCI6MTc2MzQ0NjQyNiwiZXhwIjoxNzY0MDUxMjI2fQ.4LmBmWw6pLrJCk3p9cXFE-J6fFsj6SbkFWE--eGo3sY', '2025-11-25 11:13:46'),
	(48, 36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImlhdCI6MTc2MzQ0NjQzMiwiZXhwIjoxNzY0MDUxMjMyfQ.0SzgwJE8lUVkn2vJvw6cyyoHHQrFAhdmKui0YnzfXGE', '2025-11-25 11:13:52'),
	(49, 36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImlhdCI6MTc2MzQ0NjQ2MSwiZXhwIjoxNzY0MDUxMjYxfQ.0s5f67uRRDNdwIsM8A83V3PZiQMueZTBHXjSkecjRgs', '2025-11-25 11:14:21'),
	(50, 36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImlhdCI6MTc2MzQ0NjQ2OSwiZXhwIjoxNzY0MDUxMjY5fQ.Gt1RJyoPCjsv0coPGjYAyR4xHTtKFGa30cT6UQ0ikp8', '2025-11-25 11:14:29'),
	(51, 36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImlhdCI6MTc2MzQ0NjQ3NSwiZXhwIjoxNzY0MDUxMjc1fQ.sjmYTQ4G2SRAu4H-pkkgL56fuK3siZckMX32-xNnV7s', '2025-11-25 11:14:35'),
	(52, 36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImlhdCI6MTc2MzQ0NjQ4MSwiZXhwIjoxNzY0MDUxMjgxfQ.f1-kxL6vSx46G5TXtrkHWLd9YoAZHwtOPvy1s1-AnEY', '2025-11-25 11:14:41'),
	(53, 36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImlhdCI6MTc2MzQ0NjQ4OSwiZXhwIjoxNzY0MDUxMjg5fQ.ulxA93FuXXRbCX6jlFyPPY_d4KwF2-uIYU4QEoA0j6o', '2025-11-25 11:14:49'),
	(54, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ0NzA4MiwiZXhwIjoxNzY0MDUxODgyfQ.quNQpuYaAL6GlvMzzsbtktjgZTrhR1_9BbEMKghRCtI', '2025-11-25 11:24:42'),
	(55, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ0NzE3OCwiZXhwIjoxNzY0MDUxOTc4fQ.6pnWCMz8Akml5QkJpqFFv7JBgc_1zsokTxk4Yiy4Wtg', '2025-11-25 11:26:18'),
	(56, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ0ODEzMSwiZXhwIjoxNzY0MDUyOTMxfQ.bdq55DzxSpXTTV6zpFTetuOq43TDvmQJMpepp_GhDDY', '2025-11-25 11:42:11'),
	(57, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ0ODIwNiwiZXhwIjoxNzY0MDUzMDA2fQ.7gfqg-7Lwd4Susq8wXDCPk1Suur_bWvKiPhV62JYBqc', '2025-11-25 11:43:26'),
	(58, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ0ODM1NywiZXhwIjoxNzY0MDUzMTU3fQ.8cuToyz8MH8csph29YPEolamgOFO00QFvMieZItREBY', '2025-11-25 11:45:57'),
	(59, 36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImlhdCI6MTc2MzQ0ODM3MiwiZXhwIjoxNzY0MDUzMTcyfQ.AagoeTXUErfpa9t0IHohezknSlAM9IWy6LpXLfDjLno', '2025-11-25 11:46:12'),
	(60, 36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImlhdCI6MTc2MzQ0ODQyOSwiZXhwIjoxNzY0MDUzMjI5fQ.J47H0T8r7fgtGbaw2UfmTo9GOwVbqTWXDVByGEIOxoE', '2025-11-25 11:47:09'),
	(61, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ0ODQzNywiZXhwIjoxNzY0MDUzMjM3fQ.2L5Cn9brOZ0ENX50rH0Q1YXD530UhpeGRpWPJPHUMKU', '2025-11-25 11:47:17'),
	(62, 36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImlhdCI6MTc2MzQ0ODQ4MCwiZXhwIjoxNzY0MDUzMjgwfQ.VDaGPBNYdJVc9-I5k5Ycqzd6iXFnwYICU6N0HQEsLYI', '2025-11-25 11:48:00'),
	(63, 36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImlhdCI6MTc2MzQ0OTA3NywiZXhwIjoxNzY0MDUzODc3fQ.GWZ4Np4jLg8tsU-pdHz6qytHltguGFihG48pyMeem1k', '2025-11-25 11:57:57'),
	(64, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ0OTA4NywiZXhwIjoxNzY0MDUzODg3fQ.9yr-T7v8gHb_FMJe_M3iXXVMimte7OMnyJiBVrg3iGE', '2025-11-25 11:58:07'),
	(65, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ0OTI1MywiZXhwIjoxNzY0MDU0MDUzfQ.BQ8woHlDhFeUfJI3hIRWt-RSRXAB3zpodFYi8YvfYlQ', '2025-11-25 12:00:53'),
	(66, 36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImlhdCI6MTc2MzQ0OTI1OCwiZXhwIjoxNzY0MDU0MDU4fQ.TSRROwF8sTwwVZpYOsjolNx2PchMsDsTKxbcaNkyou0', '2025-11-25 12:00:58'),
	(67, 36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImlhdCI6MTc2MzQ1MDM4MywiZXhwIjoxNzY0MDU1MTgzfQ.ZvjSBCklAlfMY8H--uimu48pRAV-5aWFX6GKLOtAFWE', '2025-11-25 12:19:43'),
	(68, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ1MDQyOCwiZXhwIjoxNzY0MDU1MjI4fQ.Qv0yltQnqCMyi-Uzde1HB_9bmDctQiMkndS-0z4KdB4', '2025-11-25 12:20:28'),
	(69, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ1MDU5NywiZXhwIjoxNzY0MDU1Mzk3fQ.av_o9JtqpukSXLkiKdcepuWPemYlyhxTcRhLm33Kk48', '2025-11-25 12:23:17'),
	(70, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ1MDg4NywiZXhwIjoxNzY0MDU1Njg3fQ.dKWPKVoOGoYUDhzD2i6qVsb44YMuAkEAHldfUh-rbrU', '2025-11-25 12:28:07'),
	(71, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ1MTE5MSwiZXhwIjoxNzY0MDU1OTkxfQ.md-Al5gNbsLiU4gn0rSAKhnKDyVPdo0T8-pApKT_KTs', '2025-11-25 12:33:11'),
	(72, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ1MjI3NywiZXhwIjoxNzY0MDU3MDc3fQ.5gzqE2KD0o_JsXj6Fa3FRjcbgiuKl3AQl5w3CiOTA0k', '2025-11-25 12:51:17'),
	(73, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ1Mjk1NCwiZXhwIjoxNzY0MDU3NzU0fQ.9aR_0DZaKsY-0RD_YNtm0Il9FrnRfsRqciL3CkcmQI0', '2025-11-25 13:02:34'),
	(74, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ1MzA0MywiZXhwIjoxNzY0MDU3ODQzfQ.v09__vEIje1SOibYbrIF-vifMJz19NWR_1izjOPXej4', '2025-11-25 13:04:03'),
	(75, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ1MzkzNiwiZXhwIjoxNzY0MDU4NzM2fQ.5MKjlG8F5YNQdTIO5LpP6HC2tVcoOyj1ozPmCMHq-bw', '2025-11-25 13:18:56'),
	(76, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ1NDA0NCwiZXhwIjoxNzY0MDU4ODQ0fQ.jPT7GOuUguBdMw4JVpH8YjpNo_Ph4Y44eNdIi2tBr50', '2025-11-25 13:20:44'),
	(77, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ1NDExMiwiZXhwIjoxNzY0MDU4OTEyfQ.KCx2-Lxeua6Uxayy8ZI121eEwykzszHig2RXpq1IbkA', '2025-11-25 13:21:52'),
	(78, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ1NDY5NiwiZXhwIjoxNzY0MDU5NDk2fQ.9WXJ_Ig7pQnPOQHrsoJgC4x4apoEMWCUuGt06UacCyY', '2025-11-25 13:31:36'),
	(81, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ1NjAxOSwiZXhwIjoxNzY0MDYwODE5fQ.mCCncdZR6kC-D7Bllhp1BpKhTCG6srl7rIz3hZB_fVU', '2025-11-25 13:53:39'),
	(82, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ1NjA4NCwiZXhwIjoxNzY0MDYwODg0fQ.x57eeBk-DVNRk3GeNksUT2ZOOEdasjNhjy8sc48GR_o', '2025-11-25 13:54:44'),
	(83, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ1NjQ5MSwiZXhwIjoxNzY0MDYxMjkxfQ.p4_Xdaj_g1uZSWov37XKqgUEpkxxcEx4zxucZB_BUKA', '2025-11-25 14:01:31'),
	(84, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ1NjU0NSwiZXhwIjoxNzY0MDYxMzQ1fQ.w5u8RBYygQSm4OICGD-aLdactLmgCQQxZ3RAoJs9qG0', '2025-11-25 14:02:25'),
	(85, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ1NjYzOSwiZXhwIjoxNzY0MDYxNDM5fQ.bluWrClniFKMF2y-SGzEVGPOCHMhMgZoYcY0chJI63M', '2025-11-25 14:03:59'),
	(86, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ1NjcwNywiZXhwIjoxNzY0MDYxNTA3fQ.Jvne1G0EbHeztpa0-HGVm7Ywc2EkvOCIo3jVyFsFveg', '2025-11-25 14:05:07'),
	(87, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ1Njg1MiwiZXhwIjoxNzY0MDYxNjUyfQ.xKVcR-Rvcv7HPtFWC6kNZ7Rj08hXrXZBETnpQ0OJzcY', '2025-11-25 14:07:32'),
	(88, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ1NjkwMiwiZXhwIjoxNzY0MDYxNzAyfQ.rzjKa4tucWil8FuObl-QePvv8TFlhRbhwt-1lU81gDA', '2025-11-25 14:08:22'),
	(89, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ1NzI0MiwiZXhwIjoxNzY0MDYyMDQyfQ.t2tGjY_cIdPmCGsCCDKpVe1Iy5KMCQ60RIutIIP9Kho', '2025-11-25 14:14:02'),
	(90, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ1NzMxNywiZXhwIjoxNzY0MDYyMTE3fQ.PKUhfyeawtGX0gPpZ93334zL3TNl_6etq4L6AUj2B78', '2025-11-25 14:15:17'),
	(91, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ1NzMzNywiZXhwIjoxNzY0MDYyMTM3fQ.7_J2N3FPqZi9K6wnAiSleYf8NGpV9vFILkbD37cCOOM', '2025-11-25 14:15:37'),
	(93, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ1ODg2OSwiZXhwIjoxNzY0MDYzNjY5fQ.nrh7-49Az8T0vzW2_oSeaLM2MqaKErJ8JXab1BMA8NM', '2025-11-25 14:41:09'),
	(94, 36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImlhdCI6MTc2MzQ1ODkwOCwiZXhwIjoxNzY0MDYzNzA4fQ.F77-5dGfY2mOdXrtDo7xkoJserIDZ2AkzCdI3T_B0i4', '2025-11-25 14:41:48'),
	(95, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ1OTMyOCwiZXhwIjoxNzY0MDY0MTI4fQ.qDnBFUGENRBa8PQZd5tj21G3-Jjm6wHzgpz7bT5o_Rc', '2025-11-25 14:48:48'),
	(96, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ2MTg3NCwiZXhwIjoxNzY0MDY2Njc0fQ.VoDgOMrsqJVAYSheLZ5SAIQFFJYQe8PzZgTjX7NQ6jY', '2025-11-25 15:31:14'),
	(98, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ2MzAwOCwiZXhwIjoxNzY0MDY3ODA4fQ.slAaaXU01Y29R8DBO5o4b75CTnb9qa-hQawCc6IX8tY', '2025-11-25 15:50:08'),
	(99, 36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImlhdCI6MTc2MzQ2MzAyNCwiZXhwIjoxNzY0MDY3ODI0fQ.V9JLXKPHz7GZyKalB_6n0SoF_hccv9GRW_sCmVL8LNY', '2025-11-25 15:50:24'),
	(100, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzQ2MzcwNiwiZXhwIjoxNzY0MDY4NTA2fQ.mpffLAw6w48qkrjbua_tG3PwX3ustbhP9gkywOlMJGc', '2025-11-25 16:01:46'),
	(103, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzUzNzc2MCwiZXhwIjoxNzY0MTQyNTYwfQ.wmSk1AZ0-97-sfd9qVviZkx_GjtO2bU0ZpHaFHLf2S8', '2025-11-26 12:36:00'),
	(104, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzU0MTQ3NywiZXhwIjoxNzY0MTQ2Mjc3fQ.LsQZLAQ-8UhrlHi408-mooBPqwI2GdcKffXStSBE2Hk', '2025-11-26 13:37:57'),
	(105, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzU0MTYyOSwiZXhwIjoxNzY0MTQ2NDI5fQ.dy2rXbQ8Adp5MR9R1uq1bK7-fqwRvjqIhu9ce1Mp668', '2025-11-26 13:40:29'),
	(106, 36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImlhdCI6MTc2MzU0MjA1NCwiZXhwIjoxNzY0MTQ2ODU0fQ.m46la3rCQSFxk5ZNdl3EbejCziT334Y_DgXb_HDqicA', '2025-11-26 13:47:34'),
	(107, 36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImlhdCI6MTc2MzU0MjI2MSwiZXhwIjoxNzY0MTQ3MDYxfQ.6tydtcXl87o6zMtSCngVTsa1JAseYa5sE2f1uC-Juss', '2025-11-26 13:51:01'),
	(108, 36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImlhdCI6MTc2MzU0Mjg0OSwiZXhwIjoxNzY0MTQ3NjQ5fQ.Xhu9SzDwguPiALM8HNQtkzUXRqt8tDNUCO8OC1RVfFk', '2025-11-26 14:00:49'),
	(109, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzU0MzIyOSwiZXhwIjoxNzY0MTQ4MDI5fQ.h8r_6KI4yq_CDOdyvVh_8amp7tOjpRcWRWLMjaSF7R8', '2025-11-26 14:07:09'),
	(110, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzU0NTM1MywiZXhwIjoxNzY0MTUwMTUzfQ.u_nKgJwl1HGvwo3T-l4QXH6wj02L7LDL0rdC7OpgSh8', '2025-11-26 14:42:33'),
	(111, 36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImlhdCI6MTc2MzU0ODAyNywiZXhwIjoxNzY0MTUyODI3fQ.01kNaYEhVKx_FQ8HyMa1ufAKgi71CfE9fJ3C19Zh9Lo', '2025-11-26 15:27:07'),
	(112, 36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImlhdCI6MTc2MzU0OTQ1MiwiZXhwIjoxNzY0MTU0MjUyfQ.HIc8HagB6GNT2hg8D8KeX5ur56OXsfEeU43YxWI1xHo', '2025-11-26 15:50:52'),
	(113, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzU0OTQ2MCwiZXhwIjoxNzY0MTU0MjYwfQ.zopSn2g17o_Mp6YvVTy3KsiJFtyY_BASu1kCrn9HnaQ', '2025-11-26 15:51:00'),
	(116, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzU1MDMxMSwiZXhwIjoxNzY0MTU1MTExfQ.wENrSrAlV25GX1opqncD-Sz1EhNzKy_RnT1px2S9YuU', '2025-11-26 16:05:11'),
	(117, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzU1MDMyNSwiZXhwIjoxNzY0MTU1MTI1fQ.9b2wRa9Bizg2x_cg7IGzwwqAcYlRFM9EBkOgLpU_BhI', '2025-11-26 16:05:25'),
	(119, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzU1MDYzNCwiZXhwIjoxNzY0MTU1NDM0fQ.zKuRl2BsRixCIlJqvdk7L0h5soKfHdjcmu1LM9e1yeM', '2025-11-26 16:10:34'),
	(122, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzYxODU0NiwiZXhwIjoxNzY0MjIzMzQ2fQ.CMkrQifih_KVmgKDFXAZl6t8hsxVQRJJHyobRfJBevI', '2025-11-27 11:02:26'),
	(123, 36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImlhdCI6MTc2MzYxODU2MiwiZXhwIjoxNzY0MjIzMzYyfQ.C7lqE7_xUZTQLB4lYT1qabRi9pu-5q1TKuvqHKAVG1w', '2025-11-27 11:02:42'),
	(124, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzYxOTY0MiwiZXhwIjoxNzY0MjI0NDQyfQ.qTVdCkrNLdFXRbXEu6RjJS2W3-rZ_K3wto4JdCOfvCs', '2025-11-27 11:20:42'),
	(125, 36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImlhdCI6MTc2MzYxOTY3NiwiZXhwIjoxNzY0MjI0NDc2fQ.8wTUacEq0ciZl2fHHMxaDKB1uFFGoXmYWBbhcAeCB1c', '2025-11-27 11:21:16'),
	(126, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzYyMzQyNSwiZXhwIjoxNzY0MjI4MjI1fQ.59gkb7Rdn8cVzGSx1XV-O6cJe6wKRrJ0_ASZAxqjWyE', '2025-11-27 12:23:45'),
	(127, 36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImlhdCI6MTc2MzYyMzUzNCwiZXhwIjoxNzY0MjI4MzM0fQ.9777-Vhj5elf3YBEvkcd5by1SZ95Rqx4GHijp3-wz24', '2025-11-27 12:25:34'),
	(128, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzYyNTUwNywiZXhwIjoxNzY0MjMwMzA3fQ.geF4Sy-ZKTgGmIxd8eZspypSsWDyRrdEO0eqPeYSRJM', '2025-11-27 12:58:27'),
	(129, 36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImlhdCI6MTc2MzYyNTYwMCwiZXhwIjoxNzY0MjMwNDAwfQ.Zo2KRlmrwdsjtdqAAPZW9zeTS6ZYVJuf0jLHgy5gGRM', '2025-11-27 13:00:00'),
	(130, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzYyNzUzNCwiZXhwIjoxNzY0MjMyMzM0fQ.mCjkHAqe0MYyuxz9_jD0O4dhtng7-Xb14llV3PgN9y0', '2025-11-27 13:32:14'),
	(131, 36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImlhdCI6MTc2MzYyNzY0NCwiZXhwIjoxNzY0MjMyNDQ0fQ.jtiJxX9EFNCmLeWl-4WOysm2JprXR-3mEpkqzX9ngEU', '2025-11-27 13:34:04'),
	(132, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzYyNzcwNiwiZXhwIjoxNzY0MjMyNTA2fQ.w_Jh1GduDMwwV7vJHwJTtcT56oumRXXQ73wywKWo62g', '2025-11-27 13:35:06'),
	(133, 36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImlhdCI6MTc2MzYyOTM4NiwiZXhwIjoxNzY0MjM0MTg2fQ.bz6vgA2y5NG8FhTTKos5cmATXX9xeaSZtczL6LFFlLQ', '2025-11-27 14:03:06'),
	(134, 36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImlhdCI6MTc2MzgxMTI3MywiZXhwIjoxNzY0NDE2MDczfQ.kPuVgHMYOhSuAu3UBVwzKCjeS3VtOhksK7HCcz_iIUI', '2025-11-29 16:34:33'),
	(135, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc2MzgxMTI4MiwiZXhwIjoxNzY0NDE2MDgyfQ.h5rgq0bCPjXMTu8Fl4cj3uV7aZlr0zjWTcCOl15x2xs', '2025-11-29 16:34:42'),
	(136, 36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImlhdCI6MTc2MzgxMTQwNywiZXhwIjoxNzY0NDE2MjA3fQ.e5hw-wH388WDZzboC1jeJOOOvfRru8vcS2uDdpdMUP4', '2025-11-29 16:36:47'),
	(137, 36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImlhdCI6MTc3MTkzMTAyMSwiZXhwIjoxNzcyNTM1ODIxfQ.9sw2sRUbI-GUPSmaU8sZjoZQ0s4Fli-rHbTyHSqDsn8', '2026-03-03 16:03:41'),
	(138, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc3MTkzMTAzMCwiZXhwIjoxNzcyNTM1ODMwfQ.qu-r80he0eddJDsON_npGC0I40QoYqGRSoeDZBXh0Og', '2026-03-03 16:03:50'),
	(139, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc3MTkzMTEzMywiZXhwIjoxNzcyNTM1OTMzfQ.rKK6bsmuoau0Cg8NLH8JaBS9gZOwujhlY_rMF3kkFwY', '2026-03-03 16:05:33'),
	(140, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc3MjAwMzUzOSwiZXhwIjoxNzcyNjA4MzM5fQ.hNtwJh9PsLGdRIhDwzzG2JTXPYNaT3AdoU_0tap4xP8', '2026-03-04 12:12:19'),
	(141, 36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImlhdCI6MTc3MjAwMzU2NSwiZXhwIjoxNzcyNjA4MzY1fQ.qO5eami6eaD6NhCQV9e-x_VQsEEYdvukGDZWjmTy79Q', '2026-03-04 12:12:45'),
	(142, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc3MjAwNDA4MSwiZXhwIjoxNzcyNjA4ODgxfQ.0-xht5GWWM2Kc5OuVjLs3Zc0mdVYmEv3RLi4ue68jIg', '2026-03-04 12:21:21'),
	(143, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc3MjAxMDYzOCwiZXhwIjoxNzcyNjE1NDM4fQ.a4rfDLOCLbAbCPsHY8HoKzewx8YW-m4a6M2FWw42yUo', '2026-03-04 14:10:38'),
	(144, 36, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImlhdCI6MTc3MjAxMTEzNiwiZXhwIjoxNzcyNjE1OTM2fQ.x_QET8OdrM0_hQGCrX30OsEMR66RropdNqHje_rCxWU', '2026-03-04 14:18:56'),
	(145, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc3MjAxMTE4OSwiZXhwIjoxNzcyNjE1OTg5fQ.1g5Zf4cIv68rXRCHuklQOnGD5SHGXnfpEAKfOz0CYQU', '2026-03-04 14:19:49'),
	(146, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc3MjAxMTQxMCwiZXhwIjoxNzcyNjE2MjEwfQ.r8Tsnqh_jqFEBGSeNnf57wtQaK7yAeLVg4PL2ChaF4A', '2026-03-04 14:23:30'),
	(147, 23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc3MjAxMjMxMCwiZXhwIjoxNzcyNjE3MTEwfQ.QgVYDWVrCsxhRUOtL-MTd7smQDhiA1ZuWoirfnmDGRA', '2026-03-04 14:38:30');

-- Dumping structure for table mobile_bio_lab.reservations
CREATE TABLE IF NOT EXISTS `reservations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `slot_id` int NOT NULL,
  `reservation_date` date NOT NULL,
  `reservation_time` varchar(20) NOT NULL,
  `duration` varchar(10) DEFAULT '1h',
  `status` varchar(20) DEFAULT 'pending',
  `sample_id` varchar(255) DEFAULT NULL,
  `sample_type` varchar(50) DEFAULT NULL,
  `collection_date` date DEFAULT NULL,
  `collection_time` time DEFAULT NULL,
  `geo_location` varchar(255) DEFAULT NULL,
  `temperature` varchar(10) DEFAULT NULL,
  `pH` varchar(10) DEFAULT NULL,
  `salinity` varchar(10) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table mobile_bio_lab.reservations: ~15 rows (approximately)
DELETE FROM `reservations`;
INSERT INTO `reservations` (`id`, `user_id`, `slot_id`, `reservation_date`, `reservation_time`, `duration`, `status`, `sample_id`, `sample_type`, `collection_date`, `collection_time`, `geo_location`, `temperature`, `pH`, `salinity`, `created_at`, `updated_at`) VALUES
	(1, 1, 10, '2025-10-06', '10:00 TO 11:30', '1h 30m', 'pending', '12', 'Water', NULL, NULL, 'Lahore', '12', '7', '4.2', '2025-10-05 10:17:55', '2025-10-05 10:17:55'),
	(2, 1, 11, '2025-10-06', '12:00 TO 13:30', '1h 30m', 'pending', '14242', 'Plant', NULL, NULL, 'lahore', '37', '8', '1.2', '2025-10-17 11:34:53', '2025-10-17 11:34:53'),
	(3, 24, 46, '2025-10-13', '12:00 TO 13:30', '1h 30m', 'pending', '44', 'Biological Fluids', NULL, NULL, 'Peshawar', '26', '9', '2.2', '2025-10-18 09:55:42', '2025-10-18 09:55:42'),
	(4, 24, 37, '2025-10-11', '14:00 TO 15:30', '1h 30m', 'approved', '45', 'Biological Fluids', NULL, NULL, 'Peshawar', '16', '7', '-0.7', '2025-10-18 09:56:47', '2025-10-19 06:28:01'),
	(5, 24, 41, '2025-10-12', '12:00 TO 13:30', '1h 30m', 'approved', '46', 'Soil', NULL, NULL, 'Peshawar', '33', '4', '4', '2025-10-18 09:57:21', '2025-11-11 06:13:54'),
	(6, 23, 26, '2025-10-09', '12:00 TO 13:30', '1h 30m', 'pending', '499', 'Plant', NULL, NULL, 'Islamabad', '12', '3.5', '0.6', '2025-11-11 06:12:22', '2025-11-11 06:12:22'),
	(7, 24, 11, '2025-10-06', '12:00 TO 13:30', '1h 30m', 'rejected', '66', 'Plant', NULL, NULL, 'lahore', '12', '5', '7.3', '2025-11-14 09:50:36', '2025-11-16 10:04:11'),
	(8, 24, 15, '2025-10-07', '10:00 TO 11:30', '1h 30m', 'pending', '77', 'Soil', NULL, NULL, 'lahore', '-4', '5', '5.4', '2025-11-16 10:11:19', '2025-11-16 10:11:19'),
	(9, 36, 13, '2025-10-06', '16:00 TO 17:30', '1h 30m', 'approved', '77', 'Plant', NULL, NULL, 'lahore', '12', '5', '5', '2025-11-18 06:46:55', '2025-11-18 07:00:09'),
	(10, 51, 26, '2025-10-09', '12:00 TO 13:30', '1h 30m', 'approved', '55', 'Soil', NULL, NULL, 'Islamabad', '33', '4', '22', '2025-11-19 11:05:00', '2025-11-19 11:05:20'),
	(11, 36, 11, '2025-10-06', '12:00 TO 13:30', '1h 30m', 'approved', '45', 'Soil', NULL, NULL, 'lahore', '45', '7', '2', '2025-11-20 06:20:30', '2025-11-20 06:21:04'),
	(12, 23, 11, '2026-03-07', '12:00 TO 13:30', '1h 30m', 'pending', '48', 'Water', NULL, NULL, 'lahore', '25', '7', '0.9', '2026-02-25 07:11:51', '2026-02-25 07:11:51'),
	(13, 36, 16, '2026-03-08', '12:00 TO 13:30', '1h 30m', 'approved', '88', 'Water', NULL, NULL, 'lahore', '33', '5', '3', '2026-02-25 07:21:09', '2026-02-25 07:21:34'),
	(14, 23, 10, '2026-03-07', '10:00 TO 11:30', '1h 30m', 'pending', '66', 'Water', NULL, NULL, 'lahore', '34', '4', '4', '2026-02-25 09:13:42', '2026-02-25 09:13:42'),
	(15, 36, 21, '2026-03-09', '12:00 TO 13:30', '1h 30m', 'approved', '55', 'Soil', NULL, NULL, 'Islamabad', '44', '3', '23', '2026-02-25 09:19:35', '2026-02-25 09:20:19');

-- Dumping structure for table mobile_bio_lab.sensor_data
CREATE TABLE IF NOT EXISTS `sensor_data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `temperature` float DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table mobile_bio_lab.sensor_data: ~7 rows (approximately)
DELETE FROM `sensor_data`;
INSERT INTO `sensor_data` (`id`, `temperature`, `timestamp`) VALUES
	(1, 25, '2025-11-06 12:02:13'),
	(2, 25, '2025-11-06 12:20:21'),
	(3, 1, '2025-11-07 11:15:51'),
	(4, 1, '2025-11-07 11:15:54'),
	(5, 1, '2025-11-07 11:15:56'),
	(6, 50, '2025-11-07 11:16:11'),
	(7, 131.06, '2025-11-08 10:17:43');

-- Dumping structure for table mobile_bio_lab.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `vu_id` varchar(50) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `profilePicture` varchar(255) DEFAULT NULL,
  `isActivated` varchar(20) NOT NULL DEFAULT 'Inactive',
  `activationToken` varchar(255) DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `resetToken` varchar(255) DEFAULT NULL,
  `resetTokenExpiry` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table mobile_bio_lab.users: ~2 rows (approximately)
DELETE FROM `users`;
INSERT INTO `users` (`id`, `first_name`, `last_name`, `vu_id`, `email`, `password`, `mobile`, `role`, `city`, `profilePicture`, `isActivated`, `activationToken`, `status`, `resetToken`, `resetTokenExpiry`) VALUES
	(23, 'Romesa', 'Khan', NULL, 'mobile.bio.lab.adm@gmail.com', '$2b$10$4ya5QIAAqOcQczONvzukiu4ftqOn05QAXLWq4huv2YrioCnk.5gE2', '03207828649', 'admin', 'Lahore, Punjab', '/uploads/profilePics/1759827690920-passport_photo_300x400_1jpg.jpg', 'Active', NULL, 'approved', NULL, NULL),
	(36, 'Romesa', 'Arshad', 'bc210428773', 'bc210428773rar@vu.edu.pk', '$2b$10$Q8TsvWdEeXciQ8BonXP2W.jo6AoSLfcVrVzL4c9RjOo5R781LRXrC', '03207828690', 'student', 'Lahore, Punjab, Pakistan', '/uploads/profilePics/1763369893369-passport_photo_300x400_1jpg.jpg', 'Active', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM2IiwiaWF0IjoxNzYzMzY5OTI4LCJleHAiOjE3NjM0NTYzMjh9.zPya03AK2P77OLKOJ13X5byau0pk5nr98WS9WyiG87s', 'approved', NULL, NULL);

-- Dumping structure for table mobile_bio_lab.users_backup
CREATE TABLE IF NOT EXISTS `users_backup` (
  `id` int NOT NULL DEFAULT '0',
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `vu_id` varchar(50) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `profilePicture` varchar(255) DEFAULT NULL,
  `isActivated` varchar(10) DEFAULT 'Inactive',
  `activationToken` varchar(255) DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `resetToken` varchar(255) DEFAULT NULL,
  `resetTokenExpiry` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table mobile_bio_lab.users_backup: ~6 rows (approximately)
DELETE FROM `users_backup`;
INSERT INTO `users_backup` (`id`, `first_name`, `last_name`, `vu_id`, `email`, `password`, `mobile`, `role`, `city`, `profilePicture`, `isActivated`, `activationToken`, `status`, `resetToken`, `resetTokenExpiry`) VALUES
	(23, 'Romesa', 'Khan', NULL, 'mobile.bio.lab.adm@gmail.com', '$2b$10$4ya5QIAAqOcQczONvzukiu4ftqOn05QAXLWq4huv2YrioCnk.5gE2', '03207828649', 'admin', 'Lahore, Punjab', '/uploads/profilePics/1759827690920-passport_photo_300x400_1jpg.jpg', '1', NULL, 'approved', NULL, NULL),
	(30, 'Sara', 'Ahmad', 'bc210428991', 'bc210428991rar@vu.edu.pk', '$2b$10$nvpovadNb25Lmz50Z5T8MexKooSjviFOns4CsQI.VZlK.M/B6lTLy', '03207828690', 'student', 'Lahore, Punjab, Pakistan', '/uploads/profilePics/1759827708698-passport_photo_300x400_1jpg.jpg', '0', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMwIiwiaWF0IjoxNzU5ODI3ODAxLCJleHAiOjE3NTk5MTQyMDF9.o2jFTHoYQz6OJ44JwODEC8AMDWZnGT-Oy6vYg8FThi8', 'approved', NULL, NULL),
	(31, 'Nimra', 'Lateef', 'bc210428990', 'bc210428990rar@vu.edu.pk', '$2b$10$.oVWgwIU08QmUxWtXbqH4u4QWfsUXevhjlQ0dpfoWyD2.VOBGtwaK', '03207828690', 'student', 'Lahore, Punjab, Pakistan', '/uploads/profilePics/1759732826086-passport_photo_300x400jpg.jpg', 'Inactive', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMxIiwiaWF0IjoxNzYzMjc4MjMyLCJleHAiOjE3NjMzNjQ2MzJ9.jxJZhtgtoy1Wo1GR-x04jlT6DUBKBQZPynI9apHsOxI', 'approved', NULL, NULL),
	(33, 'Dieter', 'Reeves', 'Consequatur Laborum', 'xyga@mailinator.com', '$2b$10$04gYuf9a/ue2P7V0eDOuV.zr3MAsLTr/EWz/URjWpph/CT/qWg4Wa', '03207828690', 'researcher', 'Corrupti non est s', '/uploads/profilePics/1763277971121-passport_photo_300x400jpg.jpg', 'Inactive', NULL, 'pending', NULL, NULL),
	(34, 'Jolie', 'Schroeder', 'Pariatur Magnam ut ', 'zyjyx@mailinator.com', '$2b$10$6WESScpyehtnFZXmIvIwwe2RkFPCSoWXDMorxFcDhSCh6gfZOoWQS', '03207828456', 'researcher', 'Nobis consectetur do', '/uploads/profilePics/1763278172968-passport_photo_300x400jpg.jpg', 'Inactive', NULL, 'pending', NULL, NULL),
	(36, 'Romesa', 'Arshad', 'bc210428773', 'bc210428773rar@vu.edu.pk', '$2b$10$Q8TsvWdEeXciQ8BonXP2W.jo6AoSLfcVrVzL4c9RjOo5R781LRXrC', '03207828690', 'student', 'Lahore, Punjab, Pakistan', '/uploads/profilePics/1763369893369-passport_photo_300x400_1jpg.jpg', '1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM2IiwiaWF0IjoxNzYzMzY5OTI4LCJleHAiOjE3NjM0NTYzMjh9.zPya03AK2P77OLKOJ13X5byau0pk5nr98WS9WyiG87s', 'approved', NULL, NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
