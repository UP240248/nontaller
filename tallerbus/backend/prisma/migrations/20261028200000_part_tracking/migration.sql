CREATE TABLE `FichaRefaccion` (
 `id` CHAR(36) NOT NULL, `refaccionId` CHAR(36) NOT NULL,
 `identificador` VARCHAR(80) NOT NULL, `condicion` VARCHAR(200) NOT NULL,
 `situacion` VARCHAR(30) NOT NULL, `unidad` VARCHAR(40) NULL,
 `costoAproximado` DECIMAL(15,6) NULL, `notas` VARCHAR(1000) NULL,
 `foto` MEDIUMBLOB NULL, `fotoMime` VARCHAR(30) NULL,
 `version` INTEGER NOT NULL DEFAULT 1,
 `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), `updatedAt` DATETIME(3) NOT NULL,
 UNIQUE INDEX `FichaRefaccion_identificador_key` (`identificador`),
 INDEX `FichaRefaccion_refaccionId_createdAt_idx` (`refaccionId`,`createdAt`),
 PRIMARY KEY (`id`), CONSTRAINT `FichaRefaccion_refaccionId_fkey` FOREIGN KEY (`refaccionId`) REFERENCES `Refaccion` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
