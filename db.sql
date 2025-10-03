CREATE TABLE `server`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `serverId` BIGINT UNSIGNED NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `deletedAt` DATETIME NULL
);
CREATE TABLE `notificationChannel`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `serverId` BIGINT UNSIGNED NOT NULL,
    `channelId` BIGINT UNSIGNED NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `deletedAt` DATETIME NULL
);
CREATE TABLE `notificationRole`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `serverId` BIGINT UNSIGNED NOT NULL,
    `roleId` BIGINT UNSIGNED NOT NULL,
    `createdAt` DATETIME NOT NULL,
    `deletedAt` DATETIME NULL
);
CREATE TABLE `subject`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `subject` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE `cancelledSubject`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `subjectId` BIGINT UNSIGNED NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `deletedAt` DATETIME NOT NULL
);
CREATE TABLE `cancelledClass`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `cancelledId` BIGINT UNSIGNED NOT NULL,
    `className` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME NOT NULL
);
ALTER TABLE
    `cancelledSubject` ADD CONSTRAINT `cancelledsubject_subjectid_foreign` FOREIGN KEY(`subjectId`) REFERENCES `subject`(`id`);
ALTER TABLE
    `notificationRole` ADD CONSTRAINT `notificationrole_serverid_foreign` FOREIGN KEY(`serverId`) REFERENCES `server`(`id`);
ALTER TABLE
    `cancelledClass` ADD CONSTRAINT `cancelledclass_cancelledid_foreign` FOREIGN KEY(`cancelledId`) REFERENCES `cancelledSubject`(`id`);
ALTER TABLE
    `notificationChannel` ADD CONSTRAINT `notificationchannel_serverid_foreign` FOREIGN KEY(`serverId`) REFERENCES `server`(`id`);