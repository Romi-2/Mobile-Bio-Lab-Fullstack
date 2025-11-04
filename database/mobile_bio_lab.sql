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

-- Dumping data for table mobile_bio_lab.available_slots: ~42 rows (approximately)
DELETE FROM `available_slots`;
INSERT INTO `available_slots` (`id`, `city`, `date`, `start_time`, `end_time`, `isBooked`, `created_at`, `updated_at`, `available_seats`) VALUES
	(9, 'Lahore', '2025-10-06', '08:00:00', '09:30:00', 0, '2025-10-02 10:17:28', '2025-10-05 10:15:22', 8),
	(10, 'Lahore', '2025-10-06', '10:00:00', '11:30:00', 0, '2025-10-02 10:17:28', '2025-10-02 10:17:28', 10),
	(11, 'Lahore', '2025-10-06', '12:00:00', '13:30:00', 0, '2025-10-02 10:17:28', '2025-10-17 11:34:53', 8),
	(12, 'Lahore', '2025-10-06', '14:00:00', '15:30:00', 0, '2025-10-02 10:17:28', '2025-10-02 10:17:28', 10),
	(13, 'Lahore', '2025-10-06', '16:00:00', '17:30:00', 0, '2025-10-02 10:17:28', '2025-10-02 10:17:28', 10),
	(14, 'Lahore', '2025-10-07', '08:00:00', '09:30:00', 0, '2025-10-02 10:17:28', '2025-10-02 10:17:28', 10),
	(15, 'Lahore', '2025-10-07', '10:00:00', '11:30:00', 0, '2025-10-02 10:17:28', '2025-10-02 10:17:28', 10),
	(16, 'Lahore', '2025-10-07', '12:00:00', '13:30:00', 0, '2025-10-02 10:17:28', '2025-10-02 10:17:28', 10),
	(17, 'Lahore', '2025-10-07', '14:00:00', '15:30:00', 0, '2025-10-02 10:17:28', '2025-10-05 09:35:17', 9),
	(18, 'Lahore', '2025-10-07', '16:00:00', '17:30:00', 0, '2025-10-02 10:17:28', '2025-10-02 10:17:28', 10),
	(19, 'Islamabad', '2025-10-08', '08:00:00', '09:30:00', 0, '2025-10-02 10:17:28', '2025-10-02 10:17:28', 10),
	(20, 'Islamabad', '2025-10-08', '10:00:00', '11:30:00', 0, '2025-10-02 10:17:28', '2025-10-02 10:17:28', 10),
	(21, 'Islamabad', '2025-10-08', '12:00:00', '13:30:00', 0, '2025-10-02 10:17:28', '2025-10-02 10:17:28', 10),
	(22, 'Islamabad', '2025-10-08', '14:00:00', '15:30:00', 0, '2025-10-02 10:17:28', '2025-10-02 10:17:28', 10),
	(23, 'Islamabad', '2025-10-08', '16:00:00', '17:30:00', 0, '2025-10-02 10:17:28', '2025-10-02 10:17:28', 10),
	(24, 'Islamabad', '2025-10-09', '08:00:00', '09:30:00', 0, '2025-10-02 10:17:28', '2025-10-02 10:17:28', 10),
	(25, 'Islamabad', '2025-10-09', '10:00:00', '11:30:00', 0, '2025-10-02 10:17:28', '2025-10-02 10:17:28', 10),
	(26, 'Islamabad', '2025-10-09', '12:00:00', '13:30:00', 0, '2025-10-02 10:17:28', '2025-10-02 10:17:28', 10),
	(27, 'Islamabad', '2025-10-09', '14:00:00', '15:30:00', 0, '2025-10-02 10:17:28', '2025-10-02 10:17:28', 10),
	(28, 'Islamabad', '2025-10-09', '16:00:00', '17:30:00', 0, '2025-10-02 10:17:28', '2025-10-02 10:17:28', 10),
	(29, 'Peshawar', '2025-10-10', '08:00:00', '09:30:00', 0, '2025-10-02 10:17:28', '2025-10-02 10:17:28', 10),
	(30, 'Peshawar', '2025-10-10', '10:00:00', '11:30:00', 0, '2025-10-02 10:17:28', '2025-10-02 10:17:28', 10),
	(31, 'Peshawar', '2025-10-10', '12:00:00', '13:30:00', 0, '2025-10-02 10:17:28', '2025-10-02 10:17:28', 10),
	(32, 'Peshawar', '2025-10-10', '14:00:00', '15:30:00', 0, '2025-10-02 10:17:28', '2025-10-02 10:17:28', 10),
	(33, 'Peshawar', '2025-10-10', '16:00:00', '17:30:00', 0, '2025-10-02 10:17:28', '2025-10-02 10:17:28', 10),
	(34, 'Peshawar', '2025-10-11', '08:00:00', '09:30:00', 0, '2025-10-02 10:17:28', '2025-10-02 10:17:28', 10),
	(35, 'Peshawar', '2025-10-11', '10:00:00', '11:30:00', 0, '2025-10-02 10:17:28', '2025-10-02 10:17:28', 10),
	(36, 'Peshawar', '2025-10-11', '12:00:00', '13:30:00', 0, '2025-10-02 10:17:28', '2025-10-02 10:17:28', 10),
	(37, 'Peshawar', '2025-10-11', '14:00:00', '15:30:00', 0, '2025-10-02 10:17:28', '2025-10-18 09:56:47', 9),
	(38, 'Peshawar', '2025-10-11', '16:00:00', '17:30:00', 0, '2025-10-02 10:17:28', '2025-10-02 10:17:28', 10),
	(39, 'Quetta', '2025-10-12', '08:00:00', '09:30:00', 0, '2025-10-02 10:17:28', '2025-10-02 10:17:28', 10),
	(40, 'Quetta', '2025-10-12', '10:00:00', '11:30:00', 0, '2025-10-02 10:17:28', '2025-10-02 10:17:28', 10),
	(41, 'Quetta', '2025-10-12', '12:00:00', '13:30:00', 0, '2025-10-02 10:17:28', '2025-10-18 09:57:21', 9),
	(42, 'Quetta', '2025-10-12', '14:00:00', '15:30:00', 0, '2025-10-02 10:17:28', '2025-10-02 10:17:28', 10),
	(43, 'Quetta', '2025-10-12', '16:00:00', '17:30:00', 0, '2025-10-02 10:17:28', '2025-10-02 10:17:28', 10),
	(44, 'Quetta', '2025-10-13', '08:00:00', '09:30:00', 0, '2025-10-02 10:17:28', '2025-10-02 10:17:28', 10),
	(45, 'Quetta', '2025-10-13', '10:00:00', '11:30:00', 0, '2025-10-02 10:17:28', '2025-10-02 10:17:28', 10),
	(46, 'Quetta', '2025-10-13', '12:00:00', '13:30:00', 0, '2025-10-02 10:17:28', '2025-10-18 09:55:42', 9),
	(47, 'Quetta', '2025-10-13', '14:00:00', '15:30:00', 0, '2025-10-02 10:17:28', '2025-10-02 10:17:28', 10),
	(48, 'Quetta', '2025-10-13', '16:00:00', '17:30:00', 0, '2025-10-02 10:17:28', '2025-10-02 10:17:28', 10);

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

-- Dumping data for table mobile_bio_lab.notifications: ~3 rows (approximately)
DELETE FROM `notifications`;
INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `is_read`, `created_at`) VALUES
	(6, 24, 'Reservation Approved', 'Your slot reservation for 2025-10-20 has been approved.', 0, '2025-10-19 07:20:15'),
	(7, 24, 'Sample Processing', 'Your biological sample has entered the processing phase.', 0, '2025-10-19 05:20:15'),
	(8, 24, 'Report Ready', 'Your lab test report is ready for download.', 1, '2025-10-18 07:20:15');

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

-- Dumping data for table mobile_bio_lab.protocols: ~0 rows (approximately)
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table mobile_bio_lab.refresh_tokens: ~0 rows (approximately)
DELETE FROM `refresh_tokens`;

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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table mobile_bio_lab.reservations: ~4 rows (approximately)
DELETE FROM `reservations`;
INSERT INTO `reservations` (`id`, `user_id`, `slot_id`, `reservation_date`, `reservation_time`, `duration`, `status`, `sample_id`, `sample_type`, `collection_date`, `collection_time`, `geo_location`, `temperature`, `pH`, `salinity`, `created_at`, `updated_at`) VALUES
	(1, 1, 10, '2025-10-06', '10:00 TO 11:30', '1h 30m', 'pending', '12', 'Water', NULL, NULL, 'Lahore', '12', '7', '4.2', '2025-10-05 10:17:55', '2025-10-05 10:17:55'),
	(2, 1, 11, '2025-10-06', '12:00 TO 13:30', '1h 30m', 'pending', '14242', 'Plant', NULL, NULL, 'lahore', '37', '8', '1.2', '2025-10-17 11:34:53', '2025-10-17 11:34:53'),
	(3, 24, 46, '2025-10-13', '12:00 TO 13:30', '1h 30m', 'pending', '44', 'Biological Fluids', NULL, NULL, 'Peshawar', '26', '9', '2.2', '2025-10-18 09:55:42', '2025-10-18 09:55:42'),
	(4, 24, 37, '2025-10-11', '14:00 TO 15:30', '1h 30m', 'approved', '45', 'Biological Fluids', NULL, NULL, 'Peshawar', '16', '7', '-0.7', '2025-10-18 09:56:47', '2025-10-19 06:28:01'),
	(5, 24, 41, '2025-10-12', '12:00 TO 13:30', '1h 30m', 'pending', '46', 'Soil', NULL, NULL, 'Peshawar', '33', '4', '4', '2025-10-18 09:57:21', '2025-10-18 09:57:21');

-- Dumping structure for table mobile_bio_lab.sensor_data
CREATE TABLE IF NOT EXISTS `sensor_data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `temperature` float DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table mobile_bio_lab.sensor_data: ~0 rows (approximately)
DELETE FROM `sensor_data`;

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
  `isActivated` varchar(10) DEFAULT 'Inactive',
  `activationToken` varchar(255) DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `resetToken` varchar(255) DEFAULT NULL,
  `resetTokenExpiry` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table mobile_bio_lab.users: ~2 rows (approximately)
DELETE FROM `users`;
INSERT INTO `users` (`id`, `first_name`, `last_name`, `vu_id`, `email`, `password`, `mobile`, `role`, `city`, `profilePicture`, `isActivated`, `activationToken`, `status`, `resetToken`, `resetTokenExpiry`) VALUES
	(23, 'Romesa', 'Khan', NULL, 'mobile.bio.lab.adm@gmail.com', '$2b$10$5HVDQ9y/.qI.rk2Ew9X/aOBr0wf60xm6PuncsAFsncf5FIajcERzS', '03207828649', 'admin', 'Lahore, Punjab', '/uploads/profilePics/1759827690920-passport_photo_300x400_1jpg.jpg', '1', NULL, 'approved', '222a8e71fa29db2fad5ae668d78b2e066a7e4cdf2313d7b8fdd18d97f47ea076', 1757487928101),
	(24, 'Romesa', 'Arshad', 'bc210428773', 'bc210428773rar@vu.edu.pk', '$2b$10$.RkEswNrAov2YJ4f6SEHKO.NJlCeBdDXwqXVGQgFy1HCRdrstLqEG', '03207828649', 'student', 'Lahore, Punjab, Pakistan', '/uploads/profilePics/1757487240769-profilePicture.jpg', '1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI0IiwiaWF0IjoxNzU3MTQ1NjI3LCJleHAiOjE3NTcyMzIwMjd9._pg2prwy_ZZazcSKYS3l_cQoTE5_wtAwRvLiudlR2to', 'approved', NULL, NULL),
	(30, 'Sara', 'Ahmad', 'bc210428991', 'bc210428991rar@vu.edu.pk', '$2b$10$nvpovadNb25Lmz50Z5T8MexKooSjviFOns4CsQI.VZlK.M/B6lTLy', '03207828690', 'student', 'Lahore, Punjab, Pakistan', '/uploads/profilePics/1759827708698-passport_photo_300x400_1jpg.jpg', 'Inactive', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMwIiwiaWF0IjoxNzU5ODI3ODAxLCJleHAiOjE3NTk5MTQyMDF9.o2jFTHoYQz6OJ44JwODEC8AMDWZnGT-Oy6vYg8FThi8', 'approved', NULL, NULL),
	(31, 'Nimra', 'Lateef', 'bc210428990', 'bc210428990rar@vu.edu.pk', '$2b$10$.oVWgwIU08QmUxWtXbqH4u4QWfsUXevhjlQ0dpfoWyD2.VOBGtwaK', '03207828690', 'student', 'Lahore, Punjab, Pakistan', '/uploads/profilePics/1759732826086-passport_photo_300x400jpg.jpg', 'Inactive', NULL, 'pending', NULL, NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
