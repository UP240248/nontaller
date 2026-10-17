import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createHash, randomUUID } from 'node:crypto';
import path from 'node:path';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { Identity } from '../guards';
import { incidentReporters, IncidentsService } from './incidents.service';
export interface EvidenceFile {buffer:Buffer;size:number;mimetype:string}
export const EVIDENCE_MAX_BYTES=5*1024*1024;
export function evidenceDirectory() {return path.resolve(process.env.EVIDENCE_DIR??path.join('.local',process.env.NODE_ENV==='test'?'evidence-test':'evidence'));}
export function evidenceType(file:EvidenceFile):{mime:string;extension:string} {
 if(file.size!==file.buffer.length||file.size<16||file.size>EVIDENCE_MAX_BYTES)throw new BadRequestException('Imagen vacía o demasiado grande (máximo 5 MB)');
 const png=file.buffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))&&file.buffer.subarray(-8,-4).toString('ascii')==='IEND';
 const jpeg=file.buffer[0]===255&&file.buffer[1]===216&&file.buffer[2]===255&&file.buffer.subarray(-2).equals(Buffer.from([255,217]));
 if(png&&file.mimetype==='image/png')return {mime:'image/png',extension:'png'};
 if(jpeg&&file.mimetype==='image/jpeg')return {mime:'image/jpeg',extension:'jpg'};
 throw new BadRequestException('Solo imágenes PNG/JPEG con firma y tipo válidos');
}
@Injectable()
export class EvidenceService {
 constructor(private readonly db:PrismaService,private readonly incidents:IncidentsService){}
 async upload(id:string,file:EvidenceFile|undefined,actor:Identity) {
  if(!incidentReporters.includes(actor.role))throw new ForbiddenException('Solo operadores y mecánicos adjuntan evidencias');
  if(!file)throw new BadRequestException('Selecciona una imagen');
  const type=evidenceType(file);
  await this.incidents.detail(id,actor);
  const key=randomUUID()+'.'+type.extension;const directory=evidenceDirectory();await mkdir(directory,{recursive:true,mode:0o700});
  const location=path.join(directory,key);await writeFile(location,file.buffer,{flag:'wx',mode:0o600});
  try {
   return await this.db.$transaction(async tx=>{
    await this.incidents.authorize(tx,actor,incidentReporters);
    const incident=await this.incidents.lock(tx,id);
    if(actor.role==='OPERADOR'&&incident.reportanteId!==actor.id)throw new NotFoundException('Reporte no encontrado');
    const evidence=await tx.evidenciaFalla.create({data:{fallaId:id,autorId:actor.id,storageKey:key,mime:type.mime,size:file.size,checksum:createHash('sha256').update(file.buffer).digest('hex')},select:{id:true,mime:true,size:true,createdAt:true}});
    await tx.auditEvent.create({data:{actorId:actor.id,busId:incident.autobusId,fallaId:id,entity:'Falla',entityId:id,action:'INCIDENT_EVIDENCE',changes:{evidenciaId:evidence.id,mime:type.mime,size:file.size}}});
    return evidence;
   },{isolationLevel:Prisma.TransactionIsolationLevel.ReadCommitted});
  }catch(error){await rm(location,{force:true});throw error;}
 }
 async download(id:string,evidenceId:string,actor:Identity) {
  await this.incidents.detail(id,actor);
  const evidence=await this.db.evidenciaFalla.findFirst({where:{id:evidenceId,fallaId:id}});
  if(!evidence||!(/^[a-f0-9-]{36}\.(png|jpg)$/).test(evidence.storageKey))throw new NotFoundException('Evidencia no encontrada');
  try{const buffer=await readFile(path.join(evidenceDirectory(),evidence.storageKey));if(buffer.length!==evidence.size||createHash('sha256').update(buffer).digest('hex')!==evidence.checksum)throw new Error('integrity');return {buffer,mime:evidence.mime,filename:`evidencia-${evidence.id}.${evidence.mime==='image/png'?'png':'jpg'}`};}
  catch{throw new NotFoundException('Archivo de evidencia no disponible');}
 }
}
