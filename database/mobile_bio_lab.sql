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
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table mobile_bio_lab.users: ~1 rows (approximately)
DELETE FROM `users`;
INSERT INTO `users` (`id`, `first_name`, `last_name`, `vu_id`, `email`, `password`, `mobile`, `role`, `city`, `profilePicture`, `isActivated`, `activationToken`, `status`, `resetToken`, `resetTokenExpiry`) VALUES
	(23, 'Romesa', 'Khan', NULL, 'mobile.bio.lab.adm@gmail.com', '$2b$10$5HVDQ9y/.qI.rk2Ew9X/aOBr0wf60xm6PuncsAFsncf5FIajcERzS', '03207828649', 'admin', 'Lahore, Punjab', '/uploads/profilePics/1757487240769-profilePicture.jpg', '1', NULL, 'approved', '222a8e71fa29db2fad5ae668d78b2e066a7e4cdf2313d7b8fdd18d97f47ea076', 1757487928101),
	(24, 'Romesa', 'Arshad', 'bc210428773', 'bc210428773rar@vu.edu.pk', '$2b$10$.RkEswNrAov2YJ4f6SEHKO.NJlCeBdDXwqXVGQgFy1HCRdrstLqEG', '03207828649', 'student', 'Lahore, Punjab, Pakistan', '/uploads/profilePics/1757487240769-profilePicture.jpg', 'Inactive', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI0IiwiaWF0IjoxNzU3MTQ1NjI3LCJleHAiOjE3NTcyMzIwMjd9._pg2prwy_ZZazcSKYS3l_cQoTE5_wtAwRvLiudlR2to', 'approved', NULL, NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
