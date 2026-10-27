import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {randomUUID} from 'node:crypto';
import {readFile} from 'node:fs/promises';
function sql(text){const result=spawnSync('docker',['exec','-i','tallerbus-mysql-local','sh','-c','MYSQL_PWD="$MYSQL_ROOT_PASSWORD" mysql -uroot --batch --skip-column-names --default-character-set=utf8mb4'],{input:text,encoding:'utf8'});if(result.status!==0)throw new Error('Falló el ensayo SQL aislado: '+(result.stderr.match(/ERROR \d+/)?.[0]??'sin código'));return result.stdout.trim();}
test('migración a usuario conserva cuentas, hashes, sesiones e historial y resuelve colisiones',async()=>{
 const info=spawnSync('docker',['inspect','tallerbus-mysql-local'],{encoding:'utf8'});assert.equal(info.status,0);assert.equal(JSON.parse(info.stdout)[0].Config.Labels['tallerbus.local'],'true');
 const database='tallerbus_username_check_'+randomUUID().replaceAll('-','');let created=false;
 try{
 sql('CREATE DATABASE `'+database+'` CHARACTER SET utf8mb4;');created=true;
 const prefix='USE `'+database+'`;\n';
 sql(prefix+"CREATE TABLE User (id CHAR(36) PRIMARY KEY,name VARCHAR(100),email VARCHAR(190),passwordHash VARCHAR(255),role VARCHAR(30),active BOOLEAN,version INT,createdAt DATETIME(3),UNIQUE INDEX User_email_key(email)); CREATE TABLE Session (id INT PRIMARY KEY,userId CHAR(36), FOREIGN KEY(userId) REFERENCES User(id)); CREATE TABLE AuditEvent (id INT PRIMARY KEY,actorId CHAR(36),FOREIGN KEY(actorId) REFERENCES User(id));");
 const addresses=['juan@uno.invalid','juan@dos.invalid','a@uno.invalid','x'.repeat(80)+'@uno.invalid','.invalido@uno.invalid'];
 for(let i=0;i<addresses.length;i++)sql(prefix+"INSERT INTO User VALUES('00000000-0000-4000-8000-00000000000"+(i+1)+"','Empleado "+i+"','"+addresses[i]+"','hash-conservado-"+i+"','OPERADOR',true,4,'2026-10-01');");
 sql(prefix+"INSERT INTO Session VALUES(1,'00000000-0000-4000-8000-000000000001'); INSERT INTO AuditEvent VALUES(1,'00000000-0000-4000-8000-000000000001');");
 const fields="JSON_OBJECT('id',id,'name',name,'hash',passwordHash,'role',role,'active',active,'version',version)";
 const before=sql(prefix+'SELECT '+fields+' FROM User ORDER BY id;');
 sql(prefix+await readFile('backend/prisma/migrations/20261027190000_usernames/migration.sql','utf8'));
 assert.equal(sql(prefix+'SELECT '+fields+' FROM User ORDER BY id;'),before);
 const usernames=sql(prefix+'SELECT username FROM User ORDER BY id;').split('\n');assert.equal(usernames[0],'juan');assert.equal(new Set(usernames).size,5);for(const username of usernames)assert.match(username,/^[a-z0-9][a-z0-9._-]{2,39}$/);
 assert.equal(sql(prefix+"SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='User' AND COLUMN_NAME='email';"),'0');
 assert.equal(sql(prefix+'SELECT (SELECT COUNT(*) FROM Session)+(SELECT COUNT(*) FROM AuditEvent);'),'2');
 }finally{if(created)sql('DROP DATABASE `'+database+'`;');}
});
