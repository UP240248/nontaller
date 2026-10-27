-- Conservar IDs, hashes, roles y relaciones; el correo deja de ser dato de cuenta.
ALTER TABLE `User` ADD COLUMN `username` VARCHAR(40) NULL;
-- El primer usuario de cada base recibe el nombre corto. Los duplicados reciben
-- u_ + UUID completo (34 caracteres), sin colisión con bases limitadas a 24.
UPDATE `User` u JOIN (
SELECT id, base, ROW_NUMBER() OVER (PARTITION BY base ORDER BY createdAt, id) AS position
FROM (
 SELECT id, createdAt,
 CASE WHEN CHAR_LENGTH(REGEXP_REPLACE(LOWER(SUBSTRING_INDEX(email, '@', 1)), '[^a-z0-9._-]', '')) >= 3
 AND REGEXP_REPLACE(LOWER(SUBSTRING_INDEX(email, '@', 1)), '[^a-z0-9._-]', '') REGEXP '^[a-z0-9]'
 THEN LEFT(REGEXP_REPLACE(LOWER(SUBSTRING_INDEX(email, '@', 1)), '[^a-z0-9._-]', ''),24)
 ELSE 'usuario' END AS base
 FROM `User`
) AS candidates
) AS m ON u.id=m.id
 SET u.username=CASE WHEN m.position=1 THEN m.base ELSE CONCAT('u_',REPLACE(u.id,'-','')) END;
ALTER TABLE `User` MODIFY COLUMN `username` VARCHAR(40) NOT NULL,
 ADD UNIQUE INDEX `User_username_key` (`username`), DROP INDEX `User_email_key`, DROP COLUMN `email`;
