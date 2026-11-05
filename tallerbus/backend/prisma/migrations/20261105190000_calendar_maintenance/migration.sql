ALTER TABLE `PlanPreventivo` DROP CHECK `PlanPreventivo_km_check`;
ALTER TABLE `EjecucionPreventiva` DROP CHECK `EjecucionPreventiva_km_check`;
ALTER TABLE `PlanPreventivo` MODIFY `intervaloKm` INTEGER NULL,
 ADD `proximaFecha` DATE NULL, ADD `ultimoServicioFecha` DATE NULL;
ALTER TABLE `EjecucionPreventiva` MODIFY `intervaloKm` INTEGER NULL, MODIFY `objetivoKm` INTEGER NULL,
 ADD `fechaProgramada` DATE NULL, ADD `fechaServicio` DATE NULL, ADD `proximaFecha` DATE NULL;
ALTER TABLE `PlanPreventivo` ADD CONSTRAINT `PlanPreventivo_km_check` CHECK ((`intervaloKm` IS NULL OR (`intervaloKm` > 0 AND `intervaloKm` <= 10000000)) AND `ultimoServicioKm` >= 0 AND `version` > 0),
 ADD CONSTRAINT `PlanPreventivo_programacion_check` CHECK (`intervaloKm` IS NOT NULL OR `proximaFecha` IS NOT NULL);
ALTER TABLE `EjecucionPreventiva` ADD CONSTRAINT `EjecucionPreventiva_km_check` CHECK (`baseKm` >= 0 AND ((`intervaloKm` IS NULL AND `objetivoKm` IS NULL AND `fechaProgramada` IS NOT NULL) OR (`intervaloKm` IS NOT NULL AND `intervaloKm` > 0 AND `objetivoKm` IS NOT NULL AND `objetivoKm` = `baseKm` + `intervaloKm`)) AND (`kilometrajeCierre` IS NULL OR `kilometrajeCierre` >= `baseKm`));
CREATE INDEX `PlanPreventivo_proximaFecha_idx` ON `PlanPreventivo` (`proximaFecha`);

-- Preserve the actual completion day of existing services (workshop UTC-6).
UPDATE `EjecucionPreventiva` SET `fechaServicio` = DATE(DATE_SUB(`finalizadaAt`, INTERVAL 6 HOUR)) WHERE `finalizadaAt` IS NOT NULL;
UPDATE `PlanPreventivo` p JOIN (SELECT `planId`, MAX(`fechaServicio`) lastDay FROM `EjecucionPreventiva` GROUP BY `planId`) e ON e.`planId`=p.`id` SET p.`ultimoServicioFecha`=e.lastDay;
