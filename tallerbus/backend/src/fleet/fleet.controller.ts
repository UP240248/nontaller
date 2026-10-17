import { Body, CanActivate, Controller, ExecutionContext, ForbiddenException, Get, Injectable, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AuthRequest, SessionGuard } from '../guards';
import { PageDto } from '../dto';
import { BusActiveDto, BusQueryDto, BusStateDto, CreateBusDto, UpdateBusDto } from './fleet.dto';
import { fleetReaders, FleetService } from './fleet.service';
@Injectable()
export class FleetGuard implements CanActivate {
 canActivate(context:ExecutionContext){if(!fleetReaders.includes(context.switchToHttp().getRequest<AuthRequest>().identity.role))throw new ForbiddenException('Acceso a flota no autorizado');return true;}
}
@ApiTags('Autobuses') @ApiCookieAuth() @Controller('autobuses') @UseGuards(SessionGuard,FleetGuard)
export class FleetController {
 constructor(private readonly fleet:FleetService){}
 @Get('metricas') metrics(){return this.fleet.metrics();}
 @Get() list(@Query() q:BusQueryDto){return this.fleet.list(q);}
 @Get(':id/historial') history(@Param('id',ParseUUIDPipe) id:string,@Query() q:PageDto){return this.fleet.history(id,q);}
 @Get(':id') detail(@Param('id',ParseUUIDPipe) id:string){return this.fleet.detail(id);}
 @Post() create(@Body() dto:CreateBusDto,@Req() req:AuthRequest){return this.fleet.create(dto,req.identity.id);}
 @Patch(':id') update(@Param('id',ParseUUIDPipe) id:string,@Body() dto:UpdateBusDto,@Req() req:AuthRequest){return this.fleet.update(id,dto,req.identity.id);}
 @Patch(':id/estado') state(@Param('id',ParseUUIDPipe) id:string,@Body() dto:BusStateDto,@Req() req:AuthRequest){return this.fleet.state(id,dto,req.identity.id);}
 @Patch(':id/activacion') active(@Param('id',ParseUUIDPipe) id:string,@Body() dto:BusActiveDto,@Req() req:AuthRequest){return this.fleet.active(id,dto,req.identity.id);}
}
