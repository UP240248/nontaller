import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { Identity } from '../guards';
import { PageDto } from '../dto';
import { CreateIncidentDto, EvaluateIncidentDto, IncidentQueryDto } from './incidents.dto';
export const incidentReaders:Role[]=[Role.ADMINISTRACION,Role.LOGISTICA,Role.MECANICO,Role.OPERADOR];
export const incidentReporters:Role[]=[Role.MECANICO,Role.OPERADOR];
export const incidentSelect={id:true,ordenId:true,autobusId:true,descripcion:true,tipo:true,estado:true,prioridad:true,evaluacion:true,evaluadoAt:true,version:true,createdAt:true,updatedAt:true,reportanteId:true,autobus:{select:{id:true,numeroEconomico:true}},reportante:{select:{id:true,name:true}},evaluadoPor:{select:{id:true,name:true}},evidencias:{select:{id:true,mime:true,size:true,createdAt:true,autor:{select:{id:true,name:true}}},orderBy:{createdAt:'asc' as const}}} as const;
@Injectable()
export class IncidentsService {
 constructor(private readonly db:PrismaService){}
 scope(actor:Identity):Prisma.FallaWhereInput {return actor.role===Role.OPERADOR?{reportanteId:actor.id}:{};}
 async authorize(tx:Prisma.TransactionClient,actor:Identity,allowed:Role[]) {
  const current=await tx.user.findUnique({where:{id:actor.id},select:{role:true,active:true}});
  if(!current?.active||current.role!==actor.role||!allowed.includes(current.role))throw new ForbiddenException('Acción no autorizada para fallas');
 }
 async lock(tx:Prisma.TransactionClient,id:string){
  const hint=await tx.falla.findUnique({where:{id},select:{autobusId:true}});if(!hint)throw new NotFoundException('Reporte no encontrado');
  await tx.$queryRaw`SELECT id FROM Autobus WHERE id = ${hint.autobusId} FOR UPDATE`;
  await tx.$queryRaw`SELECT id FROM Falla WHERE id = ${id} FOR UPDATE`;
  return tx.falla.findUniqueOrThrow({where:{id}});
 }
 async detail(id:string,actor:Identity) {
  const incident=await this.db.falla.findFirst({where:{id,...this.scope(actor)},select:incidentSelect});
  if(!incident)throw new NotFoundException('Reporte no encontrado');return incident;
 }
 async list(q:IncidentQueryDto,actor:Identity) {
  if(q.desde&&q.hasta&&new Date(q.desde)>new Date(q.hasta))throw new BadRequestException('El rango de fechas es inválido');
  const where:Prisma.FallaWhereInput={...this.scope(actor),...(q.mecanicoId?{orden:{asignaciones:{some:{mecanicoId:q.mecanicoId,retiradoAt:null}}}}:{}),...(q.autobusId?{autobusId:q.autobusId}:{}),...(q.numeroEconomico?{autobus:{numeroEconomico:q.numeroEconomico}}:{}),...(q.sinOrden!==undefined?{ordenId:q.sinOrden==='true'?null:{not:null}}:{}),...(q.estado?{estado:q.estado}:{}),...(q.prioridad?{prioridad:q.prioridad}:{}),...(q.tipo?{tipo:q.tipo}:{}),...(q.desde||q.hasta?{createdAt:{...(q.desde?{gte:new Date(q.desde)}:{}),...(q.hasta?{lte:new Date(q.hasta)}:{})}}:{}),...(q.search?{OR:[{autobus:{numeroEconomico:{contains:q.search}}},{descripcion:{contains:q.search}},{tipo:{contains:q.search}}]}:{})};
  const [data,total]=await this.db.$transaction([this.db.falla.findMany({where,skip:(q.page-1)*q.limit,take:q.limit,orderBy:[{createdAt:'desc'},{id:'desc'}],select:incidentSelect}),this.db.falla.count({where})]);
  return {data,total,page:q.page,limit:q.limit};
 }
 async metrics(actor:Identity){const groups=await this.db.falla.groupBy({by:['estado'],where:this.scope(actor),_count:{_all:true}});let abiertas=0;for(const g of groups)if(g.estado!=='FINALIZADA')abiertas+=g._count._all;return {abiertas};}
 async create(input:CreateIncidentDto,actor:Identity) {
  return this.db.$transaction(async tx=>{
   await this.authorize(tx,actor,incidentReporters);
   const bus=await tx.autobus.findUnique({where:{numeroEconomico:input.numeroEconomico},select:{id:true,activo:true}});
   if(!bus?.activo)throw new BadRequestException('Unidad no disponible para reportar');
   // Bloquea la unidad para serializar con desactivación; no modifica su estado ni versión.
   await tx.$queryRaw`SELECT id FROM Autobus WHERE id = ${bus.id} FOR UPDATE`;
   const current=await tx.autobus.findUnique({where:{id:bus.id},select:{activo:true}});
   if(!current?.activo)throw new BadRequestException('Unidad no disponible para reportar');
   const incident=await tx.falla.create({data:{autobusId:bus.id,reportanteId:actor.id,descripcion:input.descripcion,tipo:input.tipo},select:incidentSelect});
   await tx.auditEvent.create({data:{actorId:actor.id,busId:bus.id,fallaId:incident.id,entity:'Falla',entityId:incident.id,action:'INCIDENT_REPORT',changes:{estado:incident.estado,tipo:incident.tipo}}});
   return incident;
  },{isolationLevel:Prisma.TransactionIsolationLevel.ReadCommitted});
 }
 async evaluate(id:string,input:EvaluateIncidentDto,actor:Identity) {
  return this.db.$transaction(async tx=>{
   await this.authorize(tx,actor,[Role.MECANICO]);
   const before=await this.lock(tx,id);
   if(before.estado==='FINALIZADA')throw new ConflictException('No se puede evaluar una falla finalizada');
   const result=await tx.falla.updateMany({where:{id,version:input.version},data:{prioridad:input.prioridad,evaluacion:input.evaluacion,evaluadoPorId:actor.id,evaluadoAt:new Date(),version:{increment:1}}});
   if(result.count!==1)throw new ConflictException('El reporte cambió. Recarga antes de evaluar.');
   await tx.auditEvent.create({data:{actorId:actor.id,busId:before.autobusId,fallaId:id,entity:'Falla',entityId:id,action:'INCIDENT_EVALUATE',changes:{before:{prioridad:before.prioridad,version:before.version},after:{prioridad:input.prioridad,version:input.version+1},motivo:input.motivo}}});
   return tx.falla.findUniqueOrThrow({where:{id},select:incidentSelect});
  },{isolationLevel:Prisma.TransactionIsolationLevel.ReadCommitted});
 }
 async history(id:string,q:PageDto,actor:Identity) {
  await this.detail(id,actor);
  const [data,total]=await this.db.$transaction([this.db.auditEvent.findMany({where:{fallaId:id},select:{id:true,action:true,createdAt:true,changes:true,actor:{select:{id:true,name:true}}},skip:(q.page-1)*q.limit,take:q.limit,orderBy:[{createdAt:'desc'},{id:'desc'}]}),this.db.auditEvent.count({where:{fallaId:id}})]);
  return {data,total,page:q.page,limit:q.limit};
 }
}
