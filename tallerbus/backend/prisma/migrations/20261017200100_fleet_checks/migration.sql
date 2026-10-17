-- Restricciones de integridad también para escrituras directas en MySQL.
ALTER TABLE `Autobus`
  ADD CONSTRAINT `Autobus_kilometraje_nonnegative` CHECK (`kilometraje` >= 0),
  ADD CONSTRAINT `Autobus_version_positive` CHECK (`version` >= 1);
