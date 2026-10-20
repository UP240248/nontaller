import { Body, CanActivate, Controller, ExecutionContext, ForbiddenException, Get, Injectable, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AuthRequest, SessionGuard } from '../guards';
import { PageDto } from '../dto';
import { ActivePlanDto, ChecklistDto, CreatePlanDto, PlanQueryDto, SchedulePlanDto, UpdatePlanDto } from './maintenance.dto';
import { MaintenanceService } from './maintenance.service';
@Injectable()
export class MaintenanceGuard implements CanActivate {canActivate(c:ExecutionContext){const role=c.switchToHttp().getRequest<AuthRequest>().identity.role;if(!([Role.ADMINISTRACION,Role.LOGISTICA,Role.MECANICO] as Role[]).includes(role))throw new ForbiddenException('Acceso a mantenimiento no autorizado');return true;}}
@Injectable()
export class MaintenanceWriter implements CanActivate {canActivate(c:ExecutionContext){if(c.switchToHttp().getRequest<AuthRequest>().identity.role!==Role.LOGISTICA)throw new ForbiddenException('Solo Logística configura y programa mantenimiento');return true;}}
@Injectable()
export class MaintenanceMechanic implements CanActivate {canActivate(c:ExecutionContext){if(c.switchToHttp().getRequest<AuthRequest>().identity.role!==Role.MECANICO)throw new ForbiddenException('Solo el mecánico asignado registra su checklist');return true;}}
@ApiTags('Mantenimiento preventivo') @ApiCookieAuth() @Controller('mantenimiento') @UseGuards(SessionGuard,MaintenanceGuard)
export class MaintenanceController {
 constructor(private readonly maintenance:MaintenanceService){}
 @Get('planes') list(@Query() q:PlanQueryDto){return this.maintenance.list(q);}
 @Post('planes') @UseGuards(MaintenanceWriter) create(@Body() dto:CreatePlanDto,@Req() req:AuthRequest){return this.maintenance.create(dto,req.identity);}
 @Get('planes/:id') detail(@Param('id',ParseUUIDPipe) id:string){return this.maintenance.detail(id);}
 @Patch('planes/:id') @UseGuards(MaintenanceWriter) update(@Param('id',ParseUUIDPipe) id:string,@Body() dto:UpdatePlanDto,@Req() req:AuthRequest){return this.maintenance.update(id,dto,req.identity);}
 @Patch('planes/:id/activacion') @UseGuards(MaintenanceWriter) active(@Param('id',ParseUUIDPipe) id:string,@Body() dto:ActivePlanDto,@Req() req:AuthRequest){return this.maintenance.active(id,dto,req.identity);}
 @Post('planes/:id/programar') @UseGuards(MaintenanceWriter) schedule(@Param('id',ParseUUIDPipe) id:string,@Body() dto:SchedulePlanDto,@Req() req:AuthRequest){return this.maintenance.schedule(id,dto,req.identity);}
 @Get('planes/:id/ejecuciones') executions(@Param('id',ParseUUIDPipe) id:string,@Query() q:PageDto){return this.maintenance.executions(id,q);}
 @Get('planes/:id/historial') history(@Param('id',ParseUUIDPipe) id:string,@Query() q:PageDto){return this.maintenance.history(id,q);}
 @Get('ejecuciones/:id') execution(@Param('id',ParseUUIDPipe) id:string){return this.maintenance.execution(id);}
 @Patch('ejecuciones/:id/checklist') @UseGuards(MaintenanceMechanic) checklist(@Param('id',ParseUUIDPipe) id:string,@Body() dto:ChecklistDto,@Req() req:AuthRequest){return this.maintenance.checklist(id,dto,req.identity);}
}
