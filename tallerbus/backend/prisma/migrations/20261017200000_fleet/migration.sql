-- AlterTable
ALTER TABLE `AuditEvent` ADD COLUMN `busId` CHAR(36) NULL;

-- CreateTable
CREATE TABLE `Autobus` (
    `id` CHAR(36) NOT NULL,
    `numeroEconomico` VARCHAR(30) NOT NULL,
    `placas` VARCHAR(16) NOT NULL,
    `marca` VARCHAR(80) NOT NULL,
    `modelo` VARCHAR(80) NOT NULL,
    `kilometraje` INTEGER NOT NULL,
    `estadoOperativo` ENUM('HABILITADO', 'EN_REPARACION', 'EN_ESPERA_REFACCIONES', 'FUERA_DE_SERVICIO') NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `version` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Autobus_numeroEconomico_key`(`numeroEconomico`),
    UNIQUE INDEX `Autobus_placas_key`(`placas`),
    INDEX `Autobus_activo_estadoOperativo_idx`(`activo`, `estadoOperativo`),
    INDEX `Autobus_createdAt_id_idx`(`createdAt`, `id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `AuditEvent_busId_createdAt_id_idx` ON `AuditEvent`(`busId`, `createdAt`, `id`);

-- AddForeignKey
ALTER TABLE `AuditEvent` ADD CONSTRAINT `AuditEvent_busId_fkey` FOREIGN KEY (`busId`) REFERENCES `Autobus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
