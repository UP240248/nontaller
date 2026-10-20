import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Autobus, EstadoOperativo, Prisma, Role } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { PageDto } from '../dto';
import { BusQueryDto, CreateBusDto, UpdateBusDto, BusStateDto, BusActiveDto } from './fleet.dto';
export const fleetReaders:Role[]=[Role.ADMINISTRACION,Role.LOGISTICA,Role.MECANICO];
const managers:Role[]=[Role.ADMINISTRACION,Role.LOGISTICA];
export function busSnapshot(b:Autobus) {return {numeroEconomico:b.numeroEconomico,placas:b.placas,marca:b.marca,modelo:b.modelo,kilometraje:b.kilometraje,activo:b.activo,estadoOperativo:b.estadoOperativo,version:b.version};}
@Injectable()
export class FleetService {
 constructor(private readonly db:PrismaService){}
 private async authorize(tx:Prisma.TransactionClient,actorId:string,allowed:Role[]) {
  const actor=await tx.user.findUnique({where:{id:actorId},select:{active:true,role:true}});
  if(!actor?.active||!allowed.includes(actor.role))throw new ForbiddenException('No tienes permiso para esta acción de flota');
 }
 async list(q:BusQueryDto) {
  const where:Prisma.AutobusWhereInput={...(q.activo!==undefined?{activo:q.activo==='true'}:{}),...(q.estadoOperativo?{estadoOperativo:q.estadoOperativo}:{}),...(q.search?{OR:[{numeroEconomico:{contains:q.search.trim().toUpperCase()}},...(q.search.toUpperCase().replace(/[\s-]/g,'')?[{placas:{contains:q.search.toUpperCase().replace(/[\s-]/g,'')}}]:[]),{marca:{contains:q.search}},{modelo:{contains:q.search}}]}:{})};
  const [data,total]=await this.db.$transaction([this.db.autobus.findMany({where,skip:(q.page-1)*q.limit,take:q.limit,orderBy:[{[q.sort]:q.direction},{id:'asc'}]}),this.db.autobus.count({where})]);
  return {data,total,page:q.page,limit:q.limit};
 }
 async detail(id:string) {const bus=await this.db.autobus.findUnique({where:{id}});if(!bus)throw new NotFoundException('Autobús no encontrado');return bus;}
 async history(id:string,q:PageDto) {
  await this.detail(id);
  const [data,total]=await this.db.$transaction([this.db.auditEvent.findMany({where:{busId:id},skip:(q.page-1)*q.limit,take:q.limit,orderBy:[{createdAt:'desc'},{id:'desc'}],select:{id:true,action:true,changes:true,createdAt:true,actor:{select:{id:true,name:true}}}}),this.db.auditEvent.count({where:{busId:id}})]);
  return {data,total,page:q.page,limit:q.limit};
 }
 async metrics() {
  const groups=await this.db.autobus.groupBy({by:['activo','estadoOperativo'],_count:{_all:true}});
  const porEstado=Object.fromEntries(Object.values(EstadoOperativo).map(state=>[state,0]));
  let total=0,activos=0,disponibles=0,enTaller=0;
  for(const g of groups){const n=g._count._all;total+=n;porEstado[g.estadoOperativo]=(porEstado[g.estadoOperativo]??0)+n;if(g.activo){activos+=n;if(g.estadoOperativo===EstadoOperativo.HABILITADO)disponibles+=n;if(g.estadoOperativo===EstadoOperativo.EN_REPARACION||g.estadoOperativo===EstadoOperativo.EN_ESPERA_REFACCIONES)enTaller+=n;}}
  return {total,activos,inactivos:total-activos,disponibles,enTaller,porEstado};
 }
 async create(input:CreateBusDto,actorId:string) {
  return this.db.$transaction(async tx=>{
   await this.authorize(tx,actorId,managers);
   const bus=await tx.autobus.create({data:input});
   await tx.auditEvent.create({data:{actorId,busId:bus.id,entity:'Autobus',entityId:bus.id,action:'BUS_CREATE',changes:{after:busSnapshot(bus)}}});
   return bus;
  });
 }
 private async change(id:string,version:number,motivo:string,patch:Prisma.AutobusUpdateManyMutationInput,actorId:string,allowed:Role[],action:string) {
  return this.db.$transaction(async tx=>{
   await this.authorize(tx,actorId,allowed);
   await tx.$queryRaw`SELECT id FROM Autobus WHERE id = ${id} FOR UPDATE`;
   const before=await tx.autobus.findUnique({where:{id}});
   if(typeof patch.kilometraje==='number'){const latest=await tx.planPreventivo.aggregate({where:{autobusId:id},_max:{ultimoServicioKm:true}});if(latest._max.ultimoServicioKm!==null&&patch.kilometraje<latest._max.ultimoServicioKm)throw new ConflictException('El kilometraje no puede ser menor al último servicio preventivo registrado');}
   if(!before)throw new NotFoundException('Autobús no encontrado');
   if(before.version!==version)throw new ConflictException('La unidad cambió. Actualiza los datos antes de guardar.');
   const result=await tx.autobus.updateMany({where:{id,version},data:{...patch,version:{increment:1}}});
   if(result.count!==1)throw new ConflictException('La unidad cambió. Actualiza los datos antes de guardar.');
   const after=await tx.autobus.findUniqueOrThrow({where:{id}});
   await tx.auditEvent.create({data:{actorId,busId:id,entity:'Autobus',entityId:id,action,changes:{before:busSnapshot(before),after:busSnapshot(after),motivo}}});
   return after;
  },{isolationLevel:Prisma.TransactionIsolationLevel.ReadCommitted});
 }
 update(id:string,input:UpdateBusDto,actorId:string) {const {version,motivo,...patch}=input;return this.change(id,version,motivo,patch,actorId,managers,'BUS_UPDATE');}
 state(id:string,input:BusStateDto,actorId:string) {return this.change(id,input.version,input.motivo,{estadoOperativo:input.estadoOperativo},actorId,fleetReaders,'BUS_STATE');}
 active(id:string,input:BusActiveDto,actorId:string) {return this.change(id,input.version,input.motivo,{activo:input.activo},actorId,managers,'BUS_ACTIVE');}
}
