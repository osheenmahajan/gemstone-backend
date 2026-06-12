-- MySQL schema design for the Gemstone Recommendation Engine
-- Tables to create:
--   1) users
--   2) gemstones
--   3) recommendations
-- Notes:
--   * recommendations.gemstones is stored as JSON to keep the design to exactly 3 tables.

SET NAMES utf8mb4;

CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('user','admin') NOT NULL DEFAULT 'user',
  `zodiacSign` ENUM(
    'Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio',
    'Sagittarius','Capricorn','Aquarius','Pisces'
  ) NULL,
  `birthMonth` TINYINT UNSIGNED NULL,
  `preference` ENUM('healing','protection','wealth','love','clarity','energy') NOT NULL DEFAULT 'healing',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  CONSTRAINT `users_birthMonth_chk`
    CHECK (`birthMonth` IS NULL OR (`birthMonth` >= 1 AND `birthMonth` <= 12))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `gemstones` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(120) NOT NULL,
  `description` TEXT NOT NULL,
  `zodiacSigns` JSON NOT NULL,
  `birthMonths` JSON NOT NULL,
  `category` ENUM('healing','protection','wealth','love','clarity','energy') NOT NULL,
  `color` VARCHAR(80) NOT NULL,
  `imageUrl` VARCHAR(500) NOT NULL DEFAULT '',
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'INR',
  `stock` INT NOT NULL DEFAULT 10,
  `buyLink` VARCHAR(500) NOT NULL DEFAULT '',
  `benefits` VARCHAR(500) NOT NULL DEFAULT '',
  `inStock` BOOLEAN NOT NULL DEFAULT TRUE,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `gemstones_name_unique` (`name`),
  CONSTRAINT `gemstones_price_chk` CHECK (`price` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX `gemstones_inStock_category_idx` ON `gemstones` (`inStock`, `category`);
CREATE INDEX `gemstones_category_idx` ON `gemstones` (`category`);

CREATE TABLE `recommendations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `userId` BIGINT UNSIGNED NOT NULL,
  `zodiacSign` ENUM(
    'Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio',
    'Sagittarius','Capricorn','Aquarius','Pisces'
  ) NOT NULL,
  `birthMonth` TINYINT UNSIGNED NOT NULL,
  `purpose` VARCHAR(100) NOT NULL,
  -- JSON array of gemstone ids recommended for that event
  `gemstones` JSON NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `recommendations_user_fk`
    FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `recommendations_birthMonth_chk`
    CHECK (`birthMonth` >= 1 AND `birthMonth` <= 12),
  CONSTRAINT `recommendations_gemstones_not_null_chk`
    CHECK (JSON_VALID(`gemstones`) = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX `recommendations_user_createdAt_idx` ON `recommendations` (`userId`, `createdAt`);

