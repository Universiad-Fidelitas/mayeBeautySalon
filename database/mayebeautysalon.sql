-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 04, 2024 at 01:23 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mayebeautysalon`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_role` (IN `actiondb` VARCHAR(10), IN `role_ids` TEXT, IN `role_name` VARCHAR(50), IN `permissions` TEXT)   BEGIN
  CASE actiondb
    WHEN 'update' THEN
      UPDATE roles SET permissions = permissions, name = role_name WHERE FIND_IN_SET(role_id, role_ids);
    WHEN 'create' THEN
      INSERT INTO roles (name, permissions,activated) VALUES (role_name, permissions,1);
    WHEN 'delete' THEN
      UPDATE roles SET activated=0 WHERE FIND_IN_SET(role_id, role_ids);
    ELSE
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid action';
  END CASE;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_user` (IN `actiondb` VARCHAR(10), IN `user_ids` TEXT, IN `user_email` VARCHAR(150), IN `user_first_name` VARCHAR(100), IN `user_last_name` VARCHAR(100), IN `user_cedula` VARCHAR(20), IN `user_phone` VARCHAR(20), IN `user_image` VARCHAR(100), IN `user_role_id` INT, OUT `inserted_id` INT)   BEGIN
  CASE actiondb
    WHEN 'update' THEN
      UPDATE users SET role_id=user_role_id,id_card=user_cedula,first_name=user_first_name,last_name=user_last_name,email=user_email,phone=user_phone,image=user_image WHERE FIND_IN_SET(user_id, user_ids);
    WHEN 'create' THEN
      INSERT INTO users (role_id, id_card, first_name, last_name, email, phone, activated, image) VALUES (user_role_id, user_cedula, user_first_name, user_last_name, user_email, user_phone, 1, user_image);
SET inserted_id = LAST_INSERT_ID();
    WHEN 'delete' THEN
      UPDATE users SET activated=0 WHERE FIND_IN_SET(user_id, user_ids);
    ELSE
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid action';
  END CASE;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `appointment_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `activated` tinyint(1) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `auth_login`
-- (See below for the actual view)
--
CREATE TABLE `auth_login` (
`user_id` int(11)
,`id_card` varchar(20)
,`first_name` varchar(50)
,`last_name` varchar(50)
,`email` varchar(75)
,`password` varchar(100)
,`phone` varchar(20)
,`activated` tinyint(1)
,`image` varchar(100)
,`role_id` int(11)
,`role_name` varchar(50)
,`last_update` timestamp
);

-- --------------------------------------------------------

--
-- Table structure for table `bills`
--

CREATE TABLE `bills` (
  `bills_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `inventory_id` int(11) DEFAULT NULL,
  `appointment_id` int(11) DEFAULT NULL,
  `payment_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `brand_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `activated` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `activated` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `inventory_id` int(11) NOT NULL,
  `action` varchar(10) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invetory-products`
--

CREATE TABLE `invetory-products` (
  `invetory-products_id` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `inventory_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `logs`
--

CREATE TABLE `logs` (
  `log_id` int(11) NOT NULL,
  `activity` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`activity`)),
  `affected_table` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `action` varchar(10) NOT NULL,
  `error_message` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `passwords`
--

CREATE TABLE `passwords` (
  `password_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `password` varchar(100) NOT NULL,
  `last_update` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `passwords`
--

INSERT INTO `passwords` (`password_id`, `user_id`, `password`, `last_update`) VALUES
(1, 11, '$2b$10$xJDPEpHKPBvTQP5gXUGMw.HSg8ZoiwWGm5aZTwdPclXJMKMAiN8DK', '2024-01-25 22:07:49');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int(11) NOT NULL,
  `status` varchar(10) NOT NULL,
  `payment_type` varchar(10) NOT NULL,
  `voucher_path` varchar(100) DEFAULT NULL,
  `sinpe_phone_number` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `brand_id` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `size` varchar(10) NOT NULL,
  `image` varchar(200) NOT NULL,
  `activated` tinyint(1) NOT NULL,
  `provider_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `providers`
--

CREATE TABLE `providers` (
  `provider_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `activated` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ps_tokens`
--

CREATE TABLE `ps_tokens` (
  `token_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(50) NOT NULL,
  `create_at` datetime NOT NULL DEFAULT current_timestamp(),
  `expired` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ps_tokens`
--

INSERT INTO `ps_tokens` (`token_id`, `user_id`, `token`, `create_at`, `expired`) VALUES
(1, 11, '6fc1973f-e6e0-4967-a1d4-44fd1ca69593', '2024-01-25 22:04:26', 1);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `activated` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `name`, `permissions`, `activated`) VALUES
(1, 'NO DELETE', NULL, 0),
(8, 'SDASD', NULL, 0),
(9, 'admin', '{[\"table\":\"roles\",\"permissions\":\"CRUD\"]}', 0),
(10, 'admin', '{[\"table\":\"roles\",\"permissions\":\"CRUD\"]}', 1),
(11, 'admin', '{[\"table\":\"roles\",\"permissions\":\"CRUD\"]}', 1);

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `service_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `duration` decimal(10,2) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `activated` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `services-appointments`
--

CREATE TABLE `services-appointments` (
  `service-appointment_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `appointment_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `id_card` varchar(20) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(75) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `activated` tinyint(1) NOT NULL,
  `image` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `role_id`, `id_card`, `first_name`, `last_name`, `email`, `phone`, `activated`, `image`) VALUES
(11, 1, '305300042', 'Mauricio', 'Granados', 'mgranadosmunos@gmail.com', '83230353', 1, 'nuk');

-- --------------------------------------------------------

--
-- Structure for view `auth_login`
--
DROP TABLE IF EXISTS `auth_login`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `auth_login`  AS SELECT `users`.`user_id` AS `user_id`, `users`.`id_card` AS `id_card`, `users`.`first_name` AS `first_name`, `users`.`last_name` AS `last_name`, `users`.`email` AS `email`, `passwords`.`password` AS `password`, `users`.`phone` AS `phone`, `users`.`activated` AS `activated`, `users`.`image` AS `image`, `users`.`role_id` AS `role_id`, `roles`.`name` AS `role_name`, `passwords`.`last_update` AS `last_update` FROM ((`users` join `passwords` on(`users`.`user_id` = `passwords`.`user_id`)) join `roles` on(`users`.`role_id` = `roles`.`role_id`))  ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`appointment_id`);

--
-- Indexes for table `bills`
--
ALTER TABLE `bills`
  ADD PRIMARY KEY (`bills_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `inventory_id` (`inventory_id`),
  ADD KEY `appointment_id` (`appointment_id`),
  ADD KEY `payment_id` (`payment_id`);

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`brand_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`inventory_id`);

--
-- Indexes for table `invetory-products`
--
ALTER TABLE `invetory-products`
  ADD PRIMARY KEY (`invetory-products_id`),
  ADD KEY `inventory_id` (`inventory_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `passwords`
--
ALTER TABLE `passwords`
  ADD PRIMARY KEY (`password_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `brand_id` (`brand_id`),
  ADD KEY `provider_id` (`provider_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `providers`
--
ALTER TABLE `providers`
  ADD PRIMARY KEY (`provider_id`);

--
-- Indexes for table `ps_tokens`
--
ALTER TABLE `ps_tokens`
  ADD PRIMARY KEY (`token_id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`service_id`);

--
-- Indexes for table `services-appointments`
--
ALTER TABLE `services-appointments`
  ADD PRIMARY KEY (`service-appointment_id`),
  ADD KEY `service_id` (`service_id`),
  ADD KEY `appointment_id` (`appointment_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `id_card_uk` (`id_card`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `appointment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bills`
--
ALTER TABLE `bills`
  MODIFY `bills_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `brand_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `inventory_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invetory-products`
--
ALTER TABLE `invetory-products`
  MODIFY `invetory-products_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `logs`
--
ALTER TABLE `logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `passwords`
--
ALTER TABLE `passwords`
  MODIFY `password_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `providers`
--
ALTER TABLE `providers`
  MODIFY `provider_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ps_tokens`
--
ALTER TABLE `ps_tokens`
  MODIFY `token_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `service_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `services-appointments`
--
ALTER TABLE `services-appointments`
  MODIFY `service-appointment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bills`
--
ALTER TABLE `bills`
  ADD CONSTRAINT `bills_appointment_id_fk` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`appointment_id`),
  ADD CONSTRAINT `bills_inventory_id_fk` FOREIGN KEY (`inventory_id`) REFERENCES `inventory` (`inventory_id`),
  ADD CONSTRAINT `bills_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `payment_id_fk` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`payment_id`);

--
-- Constraints for table `invetory-products`
--
ALTER TABLE `invetory-products`
  ADD CONSTRAINT `inventory_id_fk` FOREIGN KEY (`inventory_id`) REFERENCES `inventory` (`inventory_id`),
  ADD CONSTRAINT `product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Constraints for table `logs`
--
ALTER TABLE `logs`
  ADD CONSTRAINT `user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `passwords`
--
ALTER TABLE `passwords`
  ADD CONSTRAINT `password_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `brand_id_fk` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`brand_id`),
  ADD CONSTRAINT `category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`),
  ADD CONSTRAINT `provider_id_fk` FOREIGN KEY (`provider_id`) REFERENCES `providers` (`provider_id`);

--
-- Constraints for table `ps_tokens`
--
ALTER TABLE `ps_tokens`
  ADD CONSTRAINT `ps_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `services-appointments`
--
ALTER TABLE `services-appointments`
  ADD CONSTRAINT `appointment_id_fk` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`appointment_id`),
  ADD CONSTRAINT `service_id_fk` FOREIGN KEY (`service_id`) REFERENCES `services` (`service_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
