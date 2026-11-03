ALTER TABLE `User` ADD COLUMN `operatorFleetVersion` INTEGER NOT NULL DEFAULT 0;
CREATE TABLE `OperadorAutobus` (
 `operadorId` CHAR(36) NOT NULL, `autobusId` CHAR(36) NOT NULL,
 `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
 PRIMARY KEY (`operadorId`,`autobusId`), INDEX `OperadorAutobus_autobusId_idx` (`autobusId`),
 CONSTRAINT `OperadorAutobus_operadorId_fkey` FOREIGN KEY (`operadorId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
 CONSTRAINT `OperadorAutobus_autobusId_fkey` FOREIGN KEY (`autobusId`) REFERENCES `Autobus` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
