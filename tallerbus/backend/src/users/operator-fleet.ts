import { BadRequestException, Body, Controller, ForbiddenException, Get, Injectable, NotFoundException, ConflictException, Param, ParseUUIDPipe, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { ArrayMaxSize, ArrayUnique, IsArray, IsInt, IsString, IsUUID, MaxLength, Min, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { AuthRequest, Identity, SessionGuard } from '../guards';
import { UserQueryDto } from '../dto';
export class OperatorUnitsDto {
 @IsInt() @Min(0) version!:number;
 @IsArray() @ArrayUnique() @ArrayMaxSize(500) @IsUUID('all',{each:true}) autobusIds!:string[];
 @Transform(({value}:{value:unknown})=>typeof value==='string'?value.trim():value) @IsString() @MinLength(3) @MaxLength(500) motivo!:string;
}
const select={id:true,name:true,username:true,active:true,operatorFleetVersion:true,unidadesOperador:{select:{autobus:{select:{id:true,numeroEconomico:true,placas:true,activo:true}}},orderBy:{autobusId:'asc' as const}}} as const;
@Injectable()
export class OperatorFleetService {
 constructor(private readonly db:PrismaService){}
 private coordinate(actor:Identity){if(actor.role!==Role.ADMINISTRACION&&actor.role!==Role.LOGISTICA)throw new ForbiddenException('Solo Administración y Logística gestionan unidades de operadores');}
 async list(q:UserQueryDto,actor:Identity){this.coordinate(actor);const where:Prisma.UserWhereInput={role:Role.OPERADOR,...(q.search?{OR:[{name:{contains:q.search}},{username:{contains:q.search}}]}:{})};const [data,total]=await this.db.$transaction([this.db.user.findMany({where,select,take:q.limit,skip:(q.page-1)*q.limit,orderBy:[{name:'asc'},{id:'asc'}]}),this.db.user.count({where})]);return {data,total,page:q.page,limit:q.limit};}
 async detail(id:string,actor:Identity){this.coordinate(actor);const user=await this.db.user.findFirst({where:{id,role:Role.OPERADOR},select});if(!user)throw new NotFoundException('Operador no encontrado');return user;}
 async own(actor:Identity){if(actor.role!==Role.OPERADOR)throw new ForbiddenException('Consulta exclusiva de operadores');const rows=await this.db.operadorAutobus.findMany({where:{operadorId:actor.id,autobus:{activo:true}},select:{autobus:{select:{id:true,numeroEconomico:true,placas:true}}},orderBy:{autobus:{numeroEconomico:'asc'}}});return {data:rows.map(r=>r.autobus)};}
 async save(id:string,input:OperatorUnitsDto,actor:Identity){this.coordinate(actor);return this.db.$transaction(async tx=>{
  // Mismo cerrojo que cambios de rol y creación de reportes de operador.
  await tx.$queryRaw`SELECT id FROM AdminLock WHERE id = 1 FOR UPDATE`;
  const current=await tx.user.findUnique({where:{id:actor.id},select:{role:true,active:true}});if(!current?.active||current.role!==actor.role)throw new ForbiddenException('La cuenta ya no tiene permiso');
  const user=await tx.user.findFirst({where:{id,role:Role.OPERADOR},select});if(!user)throw new NotFoundException('Operador no encontrado');if(!user.active)throw new ConflictException('Activa la cuenta del operador antes de asignar unidades');
  if(user.operatorFleetVersion===0&&actor.role!==Role.ADMINISTRACION)throw new ForbiddenException('Administración debe realizar la primera asignación');
  if(user.operatorFleetVersion!==input.version)throw new ConflictException('Las unidades autorizadas cambiaron. Recarga antes de guardar');
  if(user.operatorFleetVersion===0&&!input.autobusIds.length)throw new BadRequestException('Selecciona al menos una unidad para la primera asignación');
  const buses=await tx.autobus.findMany({where:{id:{in:input.autobusIds}},select:{id:true,activo:true}});const before=user.unidadesOperador.map(r=>r.autobus.id);
  if(buses.length!==input.autobusIds.length||buses.some(b=>!b.activo&&!before.includes(b.id)))throw new BadRequestException('Selecciona unidades existentes y activas');
  await tx.operadorAutobus.deleteMany({where:{operadorId:id}});if(input.autobusIds.length)await tx.operadorAutobus.createMany({data:input.autobusIds.map(autobusId=>({operadorId:id,autobusId}))});
  await tx.user.update({where:{id},data:{operatorFleetVersion:{increment:1}}});
  await tx.auditEvent.create({data:{actorId:actor.id,entity:'User',entityId:id,action:'OPERATOR_UNITS',changes:{before,after:input.autobusIds,motivo:input.motivo,version:user.operatorFleetVersion+1}}});
  return tx.user.findUniqueOrThrow({where:{id},select});
 },{isolationLevel:Prisma.TransactionIsolationLevel.ReadCommitted,maxWait:10000,timeout:20000});}
}
@Controller('operadores') @UseGuards(SessionGuard)
export class OperatorFleetController {
 constructor(private readonly fleet:OperatorFleetService){}
 @Get('mis-unidades') own(@Req() req:AuthRequest){return this.fleet.own(req.identity);}
 @Get() list(@Query() q:UserQueryDto,@Req() req:AuthRequest){return this.fleet.list(q,req.identity);}
 @Get(':id/unidades') detail(@Param('id',ParseUUIDPipe) id:string,@Req() req:AuthRequest){return this.fleet.detail(id,req.identity);}
 @Patch(':id/unidades') save(@Param('id',ParseUUIDPipe) id:string,@Body() dto:OperatorUnitsDto,@Req() req:AuthRequest){return this.fleet.save(id,dto,req.identity);}
}
