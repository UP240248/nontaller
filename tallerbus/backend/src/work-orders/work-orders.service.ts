import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { Identity } from '../guards';
import { PageDto } from '../dto';
import { AssignOrderDto, CreateOrderDto, FinishOrderDto, OrderQueryDto, StartOrderDto, WaitOrderDto } from './work-orders.dto';
const coordinators:Role[]=[Role.ADMINISTRACION,Role.LOGISTICA];
export const orderReaders:Role[]=[...coordinators,Role.MECANICO];
const select={preventivo:{select:{id:true,planId:true}},id:true,autobusId:true,titulo:true,estado:true,diagnostico:true,esperaRefacciones:true,startedAt:true,createdAt:true,updatedAt:true,version:true,autobus:{select:{id:true,numeroEconomico:true,kilometraje:true}},fallas:{select:{id:true,tipo:true,descripcion:true,estado:true,prioridad:true}},asignaciones:{select:{id:true,mecanicoId:true,retiradoAt:true,createdAt:true,mecanico:{select:{id:true,name:true,active:true,role:true}},asignadoPor:{select:{id:true,name:true}}},orderBy:{createdAt:'asc' as const}},finalizacion:{select:{id:true,trabajoRealizado:true,observaciones:true,fechaFinalizacion:true,aplicoManoObra:true,manoObraMinutos:true,aplicaronRefacciones:true,responsable:{select:{id:true,name:true}},refacciones:{select:{id:true,descripcion:true,cantidad:true,unidad:true}}}}} as const;
@Injectable()
export class WorkOrdersService {
 constructor(private readonly db:PrismaService){}
 private async authorize(tx:Prisma.TransactionClient,actor:Identity,allowed:Role[]) {
  const current=await tx.user.findUnique({where:{id:actor.id},select:{role:true,active:true}});
  if(!current?.active||current.role!==actor.role||!allowed.includes(current.role))throw new ForbiddenException('Acción de orden no autorizada');
 }
 private async lock(tx:Prisma.TransactionClient,id:string,version:number) {
  const hint=await tx.ordenTrabajo.findUnique({where:{id},select:{autobusId:true}});
  if(!hint)throw new NotFoundException('Orden no encontrada');
  await tx.$queryRaw`SELECT id FROM Autobus WHERE id = ${hint.autobusId} FOR UPDATE`;
  await tx.$queryRaw`SELECT id FROM OrdenTrabajo WHERE id = ${id} FOR UPDATE`;
  const order=await tx.ordenTrabajo.findUniqueOrThrow({where:{id},include:{fallas:true}});
  if(order.version!==version)throw new ConflictException('La orden cambió. Recarga antes de guardar.');
  if(order.estado==='FINALIZADA')throw new ConflictException('La orden ya está finalizada');
  return order;
 }
 private async assigned(tx:Prisma.TransactionClient,id:string,actor:Identity) {
  await this.authorize(tx,actor,[Role.MECANICO]);
  if(!await tx.asignacionMecanico.findFirst({where:{ordenId:id,mecanicoId:actor.id,retiradoAt:null}}))throw new ForbiddenException('Debes ser mecánico asignado a esta orden');
 }
 async detail(id:string){const order=await this.db.ordenTrabajo.findUnique({where:{id},select});if(!order)throw new NotFoundException('Orden no encontrada');return order;}
 async list(q:OrderQueryDto){if(q.desde&&q.hasta&&new Date(q.desde)>new Date(q.hasta))throw new BadRequestException('El rango de fechas es inválido');const where:Prisma.OrdenTrabajoWhereInput={...(q.mecanicoId?{asignaciones:{some:{mecanicoId:q.mecanicoId,retiradoAt:null}}}:{}),...(q.desde||q.hasta?{createdAt:{...(q.desde?{gte:new Date(q.desde)}:{}),...(q.hasta?{lte:new Date(q.hasta)}:{})}}:{}),...(q.estado?{estado:q.estado}:{}),...(q.autobusId?{autobusId:q.autobusId}:{}),...(q.search?{OR:[{titulo:{contains:q.search}},{autobus:{numeroEconomico:{contains:q.search}}}]}:{})};const [data,total]=await this.db.$transaction([this.db.ordenTrabajo.findMany({where,skip:(q.page-1)*q.limit,take:q.limit,orderBy:[{createdAt:'desc'},{id:'desc'}],select}),this.db.ordenTrabajo.count({where})]);return {data,total,page:q.page,limit:q.limit};}
 mechanics(actor:Identity){if(!coordinators.includes(actor.role))throw new ForbiddenException('Solo Administración y Logística asignan');return this.db.user.findMany({where:{role:Role.MECANICO,active:true},select:{id:true,name:true},orderBy:[{name:'asc'},{id:'asc'}]});}
 async create(input:CreateOrderDto,actor:Identity){return this.db.$transaction(async tx=>{
  await this.authorize(tx,actor,coordinators);
  const first=await tx.falla.findUnique({where:{id:input.fallaIds[0]!},select:{autobusId:true}});
  if(!first)throw new BadRequestException('Selecciona fallas existentes de una misma unidad');
  await tx.$queryRaw`SELECT id FROM Autobus WHERE id = ${first.autobusId} FOR UPDATE`;
  const fallas=await tx.falla.findMany({where:{id:{in:input.fallaIds}}});
  if(fallas.length!==input.fallaIds.length||fallas.some(f=>f.autobusId!==first.autobusId||f.ordenId||f.estado!=='PENDIENTE'||!f.prioridad))throw new ConflictException('Todas las fallas deben pertenecer a la misma unidad, estar evaluadas, pendientes y sin orden');
  const order=await tx.ordenTrabajo.create({data:{autobusId:first.autobusId,titulo:input.titulo}});
  for(const falla of fallas){await tx.falla.update({where:{id:falla.id},data:{ordenId:order.id,version:{increment:1}}});await tx.auditEvent.create({data:{actorId:actor.id,busId:first.autobusId,fallaId:falla.id,ordenId:order.id,entity:'Falla',entityId:falla.id,action:'INCIDENT_LINK_ORDER',changes:{ordenId:order.id}}});}
  await tx.auditEvent.create({data:{actorId:actor.id,busId:first.autobusId,ordenId:order.id,entity:'OrdenTrabajo',entityId:order.id,action:'ORDER_CREATE',changes:{fallaIds:input.fallaIds}}});
  return tx.ordenTrabajo.findUniqueOrThrow({where:{id:order.id},select});
 },{isolationLevel:Prisma.TransactionIsolationLevel.ReadCommitted});}
 async assign(id:string,input:AssignOrderDto,actor:Identity){return this.db.$transaction(async tx=>{
  await this.authorize(tx,actor,coordinators);const order=await this.lock(tx,id,input.version);if(actor.role!==Role.LOGISTICA&&await tx.ejecucionPreventiva.findUnique({where:{ordenId:id}}))throw new ForbiddenException('Solo Logística asigna mecánicos al preventivo');
  const mechanics=await tx.user.findMany({where:{id:{in:input.mecanicoIds},role:Role.MECANICO,active:true},select:{id:true}});
  if(mechanics.length!==input.mecanicoIds.length)throw new BadRequestException('Selecciona únicamente mecánicos activos');
  const previous=await tx.asignacionMecanico.findMany({where:{ordenId:id,retiradoAt:null}});
  for(const assignment of previous)if(!input.mecanicoIds.includes(assignment.mecanicoId))await tx.asignacionMecanico.update({where:{id:assignment.id},data:{retiradoAt:new Date(),activeKey:null}});
  for(const mecanicoId of input.mecanicoIds)if(!previous.some(a=>a.mecanicoId===mecanicoId))await tx.asignacionMecanico.create({data:{ordenId:id,mecanicoId,asignadoPorId:actor.id,activeKey:`${id}:${mecanicoId}`}});
  await tx.ordenTrabajo.update({where:{id},data:{version:{increment:1}}});
  await tx.auditEvent.create({data:{actorId:actor.id,busId:order.autobusId,ordenId:id,entity:'OrdenTrabajo',entityId:id,action:'ORDER_ASSIGN',changes:{before:previous.map(a=>a.mecanicoId),after:input.mecanicoIds,motivo:input.motivo}}});
  return tx.ordenTrabajo.findUniqueOrThrow({where:{id},select});
 },{isolationLevel:Prisma.TransactionIsolationLevel.ReadCommitted});}
 async start(id:string,input:StartOrderDto,actor:Identity){return this.db.$transaction(async tx=>{
  const order=await this.lock(tx,id,input.version);await this.assigned(tx,id,actor);
  if(order.estado!=='ABIERTA')throw new ConflictException('Solo puede iniciarse una orden abierta');
  await tx.ordenTrabajo.update({where:{id},data:{estado:'EN_PROCESO',diagnostico:input.diagnostico,startedAt:new Date(),version:{increment:1}}});
  for(const falla of order.fallas){if(falla.estado!=='PENDIENTE')throw new ConflictException('Estado de falla incompatible');await tx.falla.update({where:{id:falla.id},data:{estado:'EN_PROCESO',version:{increment:1}}});await tx.auditEvent.create({data:{actorId:actor.id,busId:order.autobusId,ordenId:id,fallaId:falla.id,entity:'Falla',entityId:falla.id,action:'INCIDENT_START',changes:{before:'PENDIENTE',after:'EN_PROCESO'}}});}
  await tx.auditEvent.create({data:{actorId:actor.id,busId:order.autobusId,ordenId:id,entity:'OrdenTrabajo',entityId:id,action:'ORDER_START',changes:{motivo:input.motivo}}});return tx.ordenTrabajo.findUniqueOrThrow({where:{id},select});
 },{isolationLevel:Prisma.TransactionIsolationLevel.ReadCommitted});}
 async wait(id:string,input:WaitOrderDto,actor:Identity){return this.db.$transaction(async tx=>{
  const order=await this.lock(tx,id,input.version);await this.assigned(tx,id,actor);
  if(order.estado!=='EN_PROCESO')throw new ConflictException('La espera se registra en órdenes en proceso');
  await tx.ordenTrabajo.update({where:{id},data:{esperaRefacciones:input.esperaRefacciones,version:{increment:1}}});
  await tx.auditEvent.create({data:{actorId:actor.id,busId:order.autobusId,ordenId:id,entity:'OrdenTrabajo',entityId:id,action:'ORDER_WAIT',changes:{before:order.esperaRefacciones,after:input.esperaRefacciones,motivo:input.motivo}}});return tx.ordenTrabajo.findUniqueOrThrow({where:{id},select});
 },{isolationLevel:Prisma.TransactionIsolationLevel.ReadCommitted});}
 async finish(id:string,input:FinishOrderDto,actor:Identity){
  if(input.aplicoManoObra?input.manoObraMinutos<1:input.manoObraMinutos!==0)throw new BadRequestException('Declara los minutos de mano de obra cuando aplique');
  if(input.aplicaronRefacciones?input.refacciones.length===0:input.refacciones.length!==0)throw new BadRequestException('Declara las refacciones utilizadas cuando apliquen');
  if(input.refacciones.some(p=>new Prisma.Decimal(p.cantidad).lte(0)))throw new BadRequestException('Las cantidades deben ser positivas');
  return this.db.$transaction(async tx=>{
   const order=await this.lock(tx,id,input.version);await this.assigned(tx,id,actor);
   if(order.estado!=='EN_PROCESO')throw new ConflictException('Inicia la orden antes de finalizar');
   const preventive=await tx.ejecucionPreventiva.findUnique({where:{ordenId:id},include:{pasos:true,plan:true}});
   if(preventive){const bus=await tx.autobus.findUniqueOrThrow({where:{id:order.autobusId}});if(input.kilometrajePreventivo!==bus.kilometraje)throw new ConflictException('Revisa el kilometraje actual de flota y recarga la orden antes de finalizar');if(preventive.finalizadaAt||!preventive.pasos.length||preventive.pasos.some(p=>!p.completado))throw new ConflictException('Completa el checklist preventivo antes de finalizar');if(bus.kilometraje<preventive.baseKm||bus.kilometraje<preventive.plan.ultimoServicioKm)throw new ConflictException('Actualiza el kilometraje del autobús antes de finalizar');if(bus.kilometraje+preventive.plan.intervaloKm>2147483647)throw new ConflictException('El próximo servicio supera el límite de kilometraje');await tx.ejecucionPreventiva.update({where:{id:preventive.id},data:{activeKey:null,kilometrajeCierre:bus.kilometraje,finalizadaAt:new Date()}});await tx.planPreventivo.update({where:{id:preventive.planId},data:{ultimoServicioKm:bus.kilometraje,version:{increment:1}}});await tx.auditEvent.create({data:{actorId:actor.id,busId:order.autobusId,ordenId:id,entity:'PlanPreventivo',entityId:preventive.planId,action:'PREVENTIVE_FINISH',changes:{ejecucionId:preventive.id,kilometrajeCierre:bus.kilometraje,ultimoServicioKmAntes:preventive.plan.ultimoServicioKm}}});}
   await tx.finalizacionOrden.create({data:{ordenId:id,responsableId:actor.id,trabajoRealizado:input.trabajoRealizado,observaciones:input.observaciones,aplicoManoObra:input.aplicoManoObra,manoObraMinutos:input.manoObraMinutos,aplicaronRefacciones:input.aplicaronRefacciones,refacciones:{create:input.refacciones.map(p=>({...p,cantidad:new Prisma.Decimal(p.cantidad)}))}}});
   await tx.ordenTrabajo.update({where:{id},data:{estado:'FINALIZADA',esperaRefacciones:false,version:{increment:1}}});
   for(const falla of order.fallas){if(falla.estado!=='EN_PROCESO')throw new ConflictException('Estado de falla incompatible');await tx.falla.update({where:{id:falla.id},data:{estado:'FINALIZADA',version:{increment:1}}});await tx.auditEvent.create({data:{actorId:actor.id,busId:order.autobusId,ordenId:id,fallaId:falla.id,entity:'Falla',entityId:falla.id,action:'INCIDENT_FINISH',changes:{before:'EN_PROCESO',after:'FINALIZADA'}}});}
   await tx.auditEvent.create({data:{actorId:actor.id,busId:order.autobusId,ordenId:id,entity:'OrdenTrabajo',entityId:id,action:'ORDER_FINISH',changes:{motivo:input.motivo,esperaRefaccionesAntes:order.esperaRefacciones,responsableId:actor.id}}});
   // Decisión explícita del usuario: sin bloqueo ni habilitación automática de la unidad.
   return tx.ordenTrabajo.findUniqueOrThrow({where:{id},select});
  },{isolationLevel:Prisma.TransactionIsolationLevel.ReadCommitted});
 }
 async history(id:string,q:PageDto){await this.detail(id);const [data,total]=await this.db.$transaction([this.db.auditEvent.findMany({where:{ordenId:id,entity:'OrdenTrabajo'},select:{id:true,action:true,createdAt:true,changes:true,actor:{select:{id:true,name:true}}},skip:(q.page-1)*q.limit,take:q.limit,orderBy:[{createdAt:'desc'},{id:'desc'}]}),this.db.auditEvent.count({where:{ordenId:id,entity:'OrdenTrabajo'}})]);return {data,total,page:q.page,limit:q.limit};}
}
