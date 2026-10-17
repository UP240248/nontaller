-- Fundamentos de identidad. No contiene datos demo ni contraseñas.
CREATE TABLE `User` (
 `id` CHAR(36) NOT NULL,
 `name` VARCHAR(100) NOT NULL,
 `email` VARCHAR(190) NOT NULL,
 `passwordHash` VARCHAR(255) NOT NULL,
 `role` ENUM('ADMINISTRACION','LOGISTICA','MECANICO','OPERADOR','CONTABILIDAD') NOT NULL,
 `active` BOOLEAN NOT NULL DEFAULT true,
 `version` INTEGER NOT NULL DEFAULT 1,
 `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
 `updatedAt` DATETIME(3) NOT NULL,
 UNIQUE INDEX `User_email_key` (`email`),
 INDEX `User_active_role_idx` (`active`, `role`),
 PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE `Session` (
 `id` CHAR(36) NOT NULL,
 `tokenHash` CHAR(64) NOT NULL,
 `userId` CHAR(36) NOT NULL,
 `expiresAt` DATETIME(3) NOT NULL,
 `revokedAt` DATETIME(3) NULL,
 `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
 UNIQUE INDEX `Session_tokenHash_key` (`tokenHash`),
 INDEX `Session_userId_revokedAt_idx` (`userId`, `revokedAt`),
 INDEX `Session_expiresAt_idx` (`expiresAt`),
 PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE `AuditEvent` (
 `id` CHAR(36) NOT NULL,
 `actorId` CHAR(36) NULL,
 `entity` VARCHAR(40) NOT NULL,
 `entityId` CHAR(36) NOT NULL,
 `action` VARCHAR(60) NOT NULL,
 `changes` JSON NULL,
 `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
 INDEX `AuditEvent_entity_entityId_createdAt_idx` (`entity`, `entityId`, `createdAt`),
 INDEX `AuditEvent_createdAt_id_idx` (`createdAt`, `id`),
 PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE TABLE `AdminLock` (`id` INTEGER NOT NULL, PRIMARY KEY (`id`)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `AuditEvent` ADD CONSTRAINT `AuditEvent_actorId_fkey` FOREIGN KEY (`actorId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
INSERT INTO `AdminLock` (`id`) VALUES (1);
