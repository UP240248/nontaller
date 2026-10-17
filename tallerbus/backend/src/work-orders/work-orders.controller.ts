import { Body, CanActivate, Controller, ExecutionContext, ForbiddenException, Get, HttpCode, Injectable, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AuthRequest, SessionGuard } from '../guards';
import { PageDto } from '../dto';
import { AssignOrderDto, CreateOrderDto, FinishOrderDto, OrderQueryDto, StartOrderDto, WaitOrderDto } from './work-orders.dto';
import { orderReaders, WorkOrdersService } from './work-orders.service';
@Injectable()
export class OrderGuard implements CanActivate{canActivate(c:ExecutionContext){if(!orderReaders.includes(c.switchToHttp().getRequest<AuthRequest>().identity.role))throw new ForbiddenException('Acceso a órdenes no autorizado');return true;}}
@ApiTags('Órdenes de trabajo') @ApiCookieAuth() @Controller('ordenes') @UseGuards(SessionGuard,OrderGuard)
export class WorkOrdersController {
 constructor(private readonly orders:WorkOrdersService){}
 @Get('mecanicos') mechanics(@Req() req:AuthRequest){return this.orders.mechanics(req.identity);}
 @Get() list(@Query() q:OrderQueryDto){return this.orders.list(q);}
 @Post() create(@Body() dto:CreateOrderDto,@Req() req:AuthRequest){return this.orders.create(dto,req.identity);}
 @Get(':id') detail(@Param('id',ParseUUIDPipe) id:string){return this.orders.detail(id);}
 @Get(':id/historial') history(@Param('id',ParseUUIDPipe) id:string,@Query() q:PageDto){return this.orders.history(id,q);}
 @Patch(':id/asignaciones') assign(@Param('id',ParseUUIDPipe) id:string,@Body() dto:AssignOrderDto,@Req() req:AuthRequest){return this.orders.assign(id,dto,req.identity);}
 @Post(':id/iniciar') @HttpCode(200) start(@Param('id',ParseUUIDPipe) id:string,@Body() dto:StartOrderDto,@Req() req:AuthRequest){return this.orders.start(id,dto,req.identity);}
 @Patch(':id/espera') wait(@Param('id',ParseUUIDPipe) id:string,@Body() dto:WaitOrderDto,@Req() req:AuthRequest){return this.orders.wait(id,dto,req.identity);}
 @Post(':id/finalizar') @HttpCode(200) finish(@Param('id',ParseUUIDPipe) id:string,@Body() dto:FinishOrderDto,@Req() req:AuthRequest){return this.orders.finish(id,dto,req.identity);}
}
