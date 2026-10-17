-- AlterTable
ALTER TABLE `AuditEvent` ADD COLUMN `fallaId` CHAR(36) NULL,
    ADD COLUMN `ordenId` CHAR(36) NULL;

-- CreateTable
CREATE TABLE `Falla` (
    `ordenId` CHAR(36) NULL,
    `id` CHAR(36) NOT NULL,
    `autobusId` CHAR(36) NOT NULL,
    `reportanteId` CHAR(36) NOT NULL,
    `descripcion` TEXT NOT NULL,
    `tipo` VARCHAR(60) NOT NULL,
    `estado` ENUM('PENDIENTE', 'EN_PROCESO', 'FINALIZADA') NOT NULL DEFAULT 'PENDIENTE',
    `prioridad` ENUM('BAJA', 'MEDIA', 'ALTA', 'CRITICA') NULL,
    `evaluacion` TEXT NULL,
    `evaluadoPorId` CHAR(36) NULL,
    `evaluadoAt` DATETIME(3) NULL,
    `version` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Falla_autobusId_estado_createdAt_idx`(`autobusId`, `estado`, `createdAt`),
    INDEX `Falla_reportanteId_createdAt_id_idx`(`reportanteId`, `createdAt`, `id`),
    INDEX `Falla_estado_prioridad_createdAt_idx`(`estado`, `prioridad`, `createdAt`),
    INDEX `Falla_ordenId_estado_idx`(`ordenId`, `estado`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EvidenciaFalla` (
    `id` CHAR(36) NOT NULL,
    `fallaId` CHAR(36) NOT NULL,
    `autorId` CHAR(36) NOT NULL,
    `storageKey` VARCHAR(45) NOT NULL,
    `checksum` CHAR(64) NOT NULL,
    `mime` VARCHAR(40) NOT NULL,
    `size` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `EvidenciaFalla_storageKey_key`(`storageKey`),
    INDEX `EvidenciaFalla_fallaId_createdAt_idx`(`fallaId`, `createdAt`),
    UNIQUE INDEX `EvidenciaFalla_fallaId_checksum_key`(`fallaId`, `checksum`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrdenTrabajo` (
    `id` CHAR(36) NOT NULL,
    `autobusId` CHAR(36) NOT NULL,
    `titulo` VARCHAR(120) NOT NULL,
    `estado` ENUM('ABIERTA', 'EN_PROCESO', 'FINALIZADA') NOT NULL DEFAULT 'ABIERTA',
    `diagnostico` TEXT NULL,
    `esperaRefacciones` BOOLEAN NOT NULL DEFAULT false,
    `startedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `version` INTEGER NOT NULL DEFAULT 1,

    INDEX `OrdenTrabajo_autobusId_estado_createdAt_idx`(`autobusId`, `estado`, `createdAt`),
    INDEX `OrdenTrabajo_estado_createdAt_id_idx`(`estado`, `createdAt`, `id`),
    UNIQUE INDEX `OrdenTrabajo_id_autobusId_key`(`id`, `autobusId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AsignacionMecanico` (
    `id` CHAR(36) NOT NULL,
    `ordenId` CHAR(36) NOT NULL,
    `mecanicoId` CHAR(36) NOT NULL,
    `asignadoPorId` CHAR(36) NOT NULL,
    `activeKey` VARCHAR(73) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `retiradoAt` DATETIME(3) NULL,

    UNIQUE INDEX `AsignacionMecanico_activeKey_key`(`activeKey`),
    INDEX `AsignacionMecanico_ordenId_retiradoAt_idx`(`ordenId`, `retiradoAt`),
    INDEX `AsignacionMecanico_mecanicoId_retiradoAt_idx`(`mecanicoId`, `retiradoAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FinalizacionOrden` (
    `id` CHAR(36) NOT NULL,
    `ordenId` CHAR(36) NOT NULL,
    `responsableId` CHAR(36) NOT NULL,
    `trabajoRealizado` TEXT NOT NULL,
    `observaciones` TEXT NOT NULL,
    `fechaFinalizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `aplicoManoObra` BOOLEAN NOT NULL,
    `manoObraMinutos` INTEGER NOT NULL,
    `aplicaronRefacciones` BOOLEAN NOT NULL,

    UNIQUE INDEX `FinalizacionOrden_ordenId_key`(`ordenId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RefaccionDescriptiva` (
    `id` CHAR(36) NOT NULL,
    `finalizacionId` CHAR(36) NOT NULL,
    `descripcion` VARCHAR(200) NOT NULL,
    `cantidad` DECIMAL(12, 3) NOT NULL,
    `unidad` VARCHAR(30) NOT NULL,

    INDEX `RefaccionDescriptiva_finalizacionId_idx`(`finalizacionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `AuditEvent_fallaId_createdAt_id_idx` ON `AuditEvent`(`fallaId`, `createdAt`, `id`);

-- CreateIndex
CREATE INDEX `AuditEvent_ordenId_createdAt_id_idx` ON `AuditEvent`(`ordenId`, `createdAt`, `id`);

-- AddForeignKey
ALTER TABLE `AuditEvent` ADD CONSTRAINT `AuditEvent_ordenId_fkey` FOREIGN KEY (`ordenId`) REFERENCES `OrdenTrabajo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditEvent` ADD CONSTRAINT `AuditEvent_fallaId_fkey` FOREIGN KEY (`fallaId`) REFERENCES `Falla`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Falla` ADD CONSTRAINT `Falla_ordenId_autobusId_fkey` FOREIGN KEY (`ordenId`, `autobusId`) REFERENCES `OrdenTrabajo`(`id`, `autobusId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Falla` ADD CONSTRAINT `Falla_autobusId_fkey` FOREIGN KEY (`autobusId`) REFERENCES `Autobus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Falla` ADD CONSTRAINT `Falla_reportanteId_fkey` FOREIGN KEY (`reportanteId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Falla` ADD CONSTRAINT `Falla_evaluadoPorId_fkey` FOREIGN KEY (`evaluadoPorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EvidenciaFalla` ADD CONSTRAINT `EvidenciaFalla_fallaId_fkey` FOREIGN KEY (`fallaId`) REFERENCES `Falla`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EvidenciaFalla` ADD CONSTRAINT `EvidenciaFalla_autorId_fkey` FOREIGN KEY (`autorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrdenTrabajo` ADD CONSTRAINT `OrdenTrabajo_autobusId_fkey` FOREIGN KEY (`autobusId`) REFERENCES `Autobus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AsignacionMecanico` ADD CONSTRAINT `AsignacionMecanico_ordenId_fkey` FOREIGN KEY (`ordenId`) REFERENCES `OrdenTrabajo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AsignacionMecanico` ADD CONSTRAINT `AsignacionMecanico_mecanicoId_fkey` FOREIGN KEY (`mecanicoId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AsignacionMecanico` ADD CONSTRAINT `AsignacionMecanico_asignadoPorId_fkey` FOREIGN KEY (`asignadoPorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FinalizacionOrden` ADD CONSTRAINT `FinalizacionOrden_ordenId_fkey` FOREIGN KEY (`ordenId`) REFERENCES `OrdenTrabajo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FinalizacionOrden` ADD CONSTRAINT `FinalizacionOrden_responsableId_fkey` FOREIGN KEY (`responsableId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RefaccionDescriptiva` ADD CONSTRAINT `RefaccionDescriptiva_finalizacionId_fkey` FOREIGN KEY (`finalizacionId`) REFERENCES `FinalizacionOrden`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Integridad adicional no representada por Prisma schema.
ALTER TABLE `Falla`
 ADD CONSTRAINT `Falla_version_positive` CHECK (`version` >= 1),
 ADD CONSTRAINT `Falla_evaluacion_consistente` CHECK (`prioridad` IS NULL OR (`evaluacion` IS NOT NULL AND `evaluadoAt` IS NOT NULL));
ALTER TABLE `EvidenciaFalla` ADD CONSTRAINT `EvidenciaFalla_size_valid` CHECK (`size` > 0 AND `size` <= 5242880);
ALTER TABLE `OrdenTrabajo` ADD CONSTRAINT `OrdenTrabajo_version_positive` CHECK (`version` >= 1);
ALTER TABLE `FinalizacionOrden` ADD CONSTRAINT `FinalizacionOrden_labor_valid` CHECK ((`aplicoManoObra` = true AND `manoObraMinutos` > 0) OR (`aplicoManoObra` = false AND `manoObraMinutos` = 0));
ALTER TABLE `RefaccionDescriptiva` ADD CONSTRAINT `RefaccionDescriptiva_cantidad_positive` CHECK (`cantidad` > 0);
