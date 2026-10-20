-- AlterTable
ALTER TABLE `AuditEvent` ADD COLUMN `proveedorId` CHAR(36) NULL,
    ADD COLUMN `refaccionId` CHAR(36) NULL;

-- CreateTable
CREATE TABLE `Refaccion` (
    `id` CHAR(36) NOT NULL,
    `sku` VARCHAR(40) NOT NULL,
    `descripcion` VARCHAR(200) NOT NULL,
    `unidad` VARCHAR(30) NOT NULL,
    `categoria` VARCHAR(60) NULL,
    `minimo` DECIMAL(12, 3) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `version` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Refaccion_sku_key`(`sku`),
    INDEX `Refaccion_activo_categoria_idx`(`activo`, `categoria`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Proveedor` (
    `id` CHAR(36) NOT NULL,
    `codigo` VARCHAR(40) NOT NULL,
    `nombre` VARCHAR(120) NOT NULL,
    `contacto` VARCHAR(100) NULL,
    `email` VARCHAR(190) NULL,
    `telefono` VARCHAR(30) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `version` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Proveedor_codigo_key`(`codigo`),
    INDEX `Proveedor_activo_nombre_idx`(`activo`, `nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InventoryLock` (
    `id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OperacionInventario` (
    `id` CHAR(36) NOT NULL,
    `hash` CHAR(64) NOT NULL,
    `respuesta` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SaldoInventario` (
    `refaccionId` CHAR(36) NOT NULL,
    `cantidad` DECIMAL(15, 3) NOT NULL,
    `valor` DECIMAL(30, 6) NOT NULL,

    PRIMARY KEY (`refaccionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MovimientoInventario` (
    `descripcion` VARCHAR(200) NOT NULL,
    `unidad` VARCHAR(30) NOT NULL,
    `id` CHAR(36) NOT NULL,
    `refaccionId` CHAR(36) NOT NULL,
    `tipo` ENUM('ENTRADA', 'ENTREGA', 'DEVOLUCION', 'AJUSTE', 'RECEPCION') NOT NULL,
    `cantidad` DECIMAL(15, 3) NOT NULL,
    `valor` DECIMAL(30, 6) NOT NULL,
    `costoUnitario` DECIMAL(30, 6) NOT NULL,
    `saldoCantidad` DECIMAL(15, 3) NOT NULL,
    `saldoValor` DECIMAL(30, 6) NOT NULL,
    `ordenId` CHAR(36) NULL,
    `origenId` CHAR(36) NULL,
    `lineaCompraId` CHAR(36) NULL,
    `actorId` CHAR(36) NOT NULL,
    `motivo` VARCHAR(500) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `MovimientoInventario_refaccionId_createdAt_id_idx`(`refaccionId`, `createdAt`, `id`),
    INDEX `MovimientoInventario_ordenId_createdAt_id_idx`(`ordenId`, `createdAt`, `id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Compra` (
    `id` CHAR(36) NOT NULL,
    `proveedorId` CHAR(36) NOT NULL,
    `referencia` VARCHAR(100) NOT NULL,
    `estado` ENUM('BORRADOR', 'APROBADA', 'PARCIAL', 'RECIBIDA', 'CANCELADA') NOT NULL DEFAULT 'BORRADOR',
    `version` INTEGER NOT NULL DEFAULT 1,
    `creadorId` CHAR(36) NOT NULL,
    `aprobadorId` CHAR(36) NULL,
    `aprobadoAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Compra_createdAt_id_idx`(`createdAt`, `id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LineaCompra` (
    `id` CHAR(36) NOT NULL,
    `compraId` CHAR(36) NOT NULL,
    `refaccionId` CHAR(36) NOT NULL,
    `descripcion` VARCHAR(200) NOT NULL,
    `unidad` VARCHAR(30) NOT NULL,
    `cantidad` DECIMAL(12, 3) NOT NULL,
    `recibida` DECIMAL(12, 3) NOT NULL DEFAULT 0,
    `costoUnitario` DECIMAL(18, 6) NOT NULL,

    UNIQUE INDEX `LineaCompra_compraId_refaccionId_key`(`compraId`, `refaccionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RegistroCompra` (
    `id` CHAR(36) NOT NULL,
    `compraId` CHAR(36) NOT NULL,
    `actorId` CHAR(36) NOT NULL,
    `accion` VARCHAR(40) NOT NULL,
    `motivo` VARCHAR(500) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `RegistroCompra_compraId_createdAt_id_idx`(`compraId`, `createdAt`, `id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `AuditEvent_refaccionId_createdAt_id_idx` ON `AuditEvent`(`refaccionId`, `createdAt`, `id`);

-- CreateIndex
CREATE INDEX `AuditEvent_proveedorId_createdAt_id_idx` ON `AuditEvent`(`proveedorId`, `createdAt`, `id`);

-- AddForeignKey
ALTER TABLE `AuditEvent` ADD CONSTRAINT `AuditEvent_refaccionId_fkey` FOREIGN KEY (`refaccionId`) REFERENCES `Refaccion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditEvent` ADD CONSTRAINT `AuditEvent_proveedorId_fkey` FOREIGN KEY (`proveedorId`) REFERENCES `Proveedor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaldoInventario` ADD CONSTRAINT `SaldoInventario_refaccionId_fkey` FOREIGN KEY (`refaccionId`) REFERENCES `Refaccion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MovimientoInventario` ADD CONSTRAINT `MovimientoInventario_refaccionId_fkey` FOREIGN KEY (`refaccionId`) REFERENCES `Refaccion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MovimientoInventario` ADD CONSTRAINT `MovimientoInventario_ordenId_fkey` FOREIGN KEY (`ordenId`) REFERENCES `OrdenTrabajo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MovimientoInventario` ADD CONSTRAINT `MovimientoInventario_origenId_fkey` FOREIGN KEY (`origenId`) REFERENCES `MovimientoInventario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MovimientoInventario` ADD CONSTRAINT `MovimientoInventario_lineaCompraId_fkey` FOREIGN KEY (`lineaCompraId`) REFERENCES `LineaCompra`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MovimientoInventario` ADD CONSTRAINT `MovimientoInventario_actorId_fkey` FOREIGN KEY (`actorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Compra` ADD CONSTRAINT `Compra_proveedorId_fkey` FOREIGN KEY (`proveedorId`) REFERENCES `Proveedor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Compra` ADD CONSTRAINT `Compra_creadorId_fkey` FOREIGN KEY (`creadorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Compra` ADD CONSTRAINT `Compra_aprobadorId_fkey` FOREIGN KEY (`aprobadorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LineaCompra` ADD CONSTRAINT `LineaCompra_compraId_fkey` FOREIGN KEY (`compraId`) REFERENCES `Compra`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LineaCompra` ADD CONSTRAINT `LineaCompra_refaccionId_fkey` FOREIGN KEY (`refaccionId`) REFERENCES `Refaccion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RegistroCompra` ADD CONSTRAINT `RegistroCompra_compraId_fkey` FOREIGN KEY (`compraId`) REFERENCES `Compra`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RegistroCompra` ADD CONSTRAINT `RegistroCompra_actorId_fkey` FOREIGN KEY (`actorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- El bloqueo existe antes de cualquier operación. Reglas de saldo también en MySQL.
INSERT INTO `InventoryLock` (`id`) VALUES (1);
ALTER TABLE `Refaccion` ADD CONSTRAINT `Refaccion_minimo_check` CHECK (`minimo` >= 0), ADD CONSTRAINT `Refaccion_version_check` CHECK (`version` >= 1);
ALTER TABLE `Proveedor` ADD CONSTRAINT `Proveedor_version_check` CHECK (`version` >= 1);
ALTER TABLE `SaldoInventario` ADD CONSTRAINT `Saldo_no_negativo` CHECK (`cantidad` >= 0 AND `valor` >= 0), ADD CONSTRAINT `Saldo_sin_residuo` CHECK (`cantidad` > 0 OR `valor` = 0);
ALTER TABLE `LineaCompra` ADD CONSTRAINT `LineaCompra_cantidades_check` CHECK (`cantidad` > 0 AND `recibida` >= 0 AND `recibida` <= `cantidad` AND `costoUnitario` >= 0);
ALTER TABLE `MovimientoInventario` ADD CONSTRAINT `Movimiento_saldo_check` CHECK (`saldoCantidad` >= 0 AND `saldoValor` >= 0 AND `costoUnitario` >= 0), ADD CONSTRAINT `Movimiento_signo_check` CHECK ((`tipo` IN ('ENTRADA','RECEPCION','DEVOLUCION') AND `cantidad` > 0 AND `valor` >= 0) OR (`tipo` = 'ENTREGA' AND `cantidad` < 0 AND `valor` <= 0) OR (`tipo` = 'AJUSTE' AND `cantidad` <> 0 AND ((`cantidad` > 0 AND `valor` >= 0) OR (`cantidad` < 0 AND `valor` <= 0))));
