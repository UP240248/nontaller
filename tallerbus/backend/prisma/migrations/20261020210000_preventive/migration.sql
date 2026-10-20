-- CreateTable
CREATE TABLE `PlanPreventivo` (
    `id` CHAR(36) NOT NULL,
    `autobusId` CHAR(36) NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `intervaloKm` INTEGER NOT NULL,
    `ultimoServicioKm` INTEGER NOT NULL,
    `checklist` JSON NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `version` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `PlanPreventivo_activo_autobusId_idx`(`activo`, `autobusId`),
    UNIQUE INDEX `PlanPreventivo_id_autobusId_key`(`id`, `autobusId`),
    UNIQUE INDEX `PlanPreventivo_autobusId_nombre_key`(`autobusId`, `nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EjecucionPreventiva` (
    `id` CHAR(36) NOT NULL,
    `planId` CHAR(36) NOT NULL,
    `autobusId` CHAR(36) NOT NULL,
    `ordenId` CHAR(36) NOT NULL,
    `activeKey` CHAR(36) NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `intervaloKm` INTEGER NOT NULL,
    `baseKm` INTEGER NOT NULL,
    `objetivoKm` INTEGER NOT NULL,
    `kilometrajeCierre` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `finalizadaAt` DATETIME(3) NULL,

    UNIQUE INDEX `EjecucionPreventiva_ordenId_key`(`ordenId`),
    UNIQUE INDEX `EjecucionPreventiva_activeKey_key`(`activeKey`),
    INDEX `EjecucionPreventiva_planId_createdAt_id_idx`(`planId`, `createdAt`, `id`),
    UNIQUE INDEX `EjecucionPreventiva_ordenId_autobusId_key`(`ordenId`, `autobusId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PasoPreventivo` (
    `id` CHAR(36) NOT NULL,
    `ejecucionId` CHAR(36) NOT NULL,
    `posicion` INTEGER NOT NULL,
    `texto` VARCHAR(200) NOT NULL,
    `completado` BOOLEAN NOT NULL DEFAULT false,
    `observaciones` VARCHAR(500) NULL,

    UNIQUE INDEX `PasoPreventivo_ejecucionId_posicion_key`(`ejecucionId`, `posicion`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PlanPreventivo` ADD CONSTRAINT `PlanPreventivo_autobusId_fkey` FOREIGN KEY (`autobusId`) REFERENCES `Autobus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EjecucionPreventiva` ADD CONSTRAINT `EjecucionPreventiva_planId_autobusId_fkey` FOREIGN KEY (`planId`, `autobusId`) REFERENCES `PlanPreventivo`(`id`, `autobusId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EjecucionPreventiva` ADD CONSTRAINT `EjecucionPreventiva_ordenId_autobusId_fkey` FOREIGN KEY (`ordenId`, `autobusId`) REFERENCES `OrdenTrabajo`(`id`, `autobusId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PasoPreventivo` ADD CONSTRAINT `PasoPreventivo_ejecucionId_fkey` FOREIGN KEY (`ejecucionId`) REFERENCES `EjecucionPreventiva`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `PlanPreventivo` ADD CONSTRAINT `PlanPreventivo_km_check` CHECK (`intervaloKm` > 0 AND `intervaloKm` <= 10000000 AND `ultimoServicioKm` >= 0 AND `version` > 0);
ALTER TABLE `EjecucionPreventiva` ADD CONSTRAINT `EjecucionPreventiva_km_check` CHECK (`intervaloKm` > 0 AND `baseKm` >= 0 AND `objetivoKm` = `baseKm` + `intervaloKm` AND (`kilometrajeCierre` IS NULL OR `kilometrajeCierre` >= `baseKm`)), ADD CONSTRAINT `EjecucionPreventiva_cierre_check` CHECK ((`finalizadaAt` IS NULL AND `kilometrajeCierre` IS NULL AND `activeKey` IS NOT NULL) OR (`finalizadaAt` IS NOT NULL AND `kilometrajeCierre` IS NOT NULL AND `activeKey` IS NULL));
ALTER TABLE `PasoPreventivo` ADD CONSTRAINT `PasoPreventivo_posicion_check` CHECK (`posicion` >= 0 AND CHAR_LENGTH(TRIM(`texto`)) >= 3);
