import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { EvidenceFile, EVIDENCE_MAX_BYTES } from '../incidents/evidence.service';
import { Res, UploadedFile, UseInterceptors, Body, CanActivate, Controller, ExecutionContext, ForbiddenException, Get, Injectable, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AuthRequest, SessionGuard } from '../guards';
import { PageDto } from '../dto';
import { PartTrackingDto, CatalogActiveDto, CatalogQueryDto, PartFieldsDto, SupplierFieldsDto, UpdatePartDto, UpdateSupplierDto } from './catalog.dto';
import { catalogReaders, CatalogService } from './catalog.service';
@Injectable()
export class CatalogGuard implements CanActivate {canActivate(c:ExecutionContext){if(!catalogReaders.includes(c.switchToHttp().getRequest<AuthRequest>().identity.role))throw new ForbiddenException('Acceso a catálogos no autorizado');return true;}}
@ApiTags('Refacciones') @ApiCookieAuth() @Controller('refacciones') @UseGuards(SessionGuard,CatalogGuard)
export class PartsController {
 constructor(private readonly catalog:CatalogService){}
 @Get() list(@Query() q:CatalogQueryDto){return this.catalog.parts(q);}
 @Get('fichas/lista') tracking(@Query() q:PageDto){return this.catalog.tracking(q);}
 @Post('fichas') trackingCreate(@Body() dto:PartTrackingDto,@Req() req:AuthRequest){return this.catalog.saveTracking(null,dto,req.identity);}
 @Patch('fichas/:id') trackingUpdate(@Param('id',ParseUUIDPipe) id:string,@Body() dto:PartTrackingDto,@Req() req:AuthRequest){return this.catalog.saveTracking(id,dto,req.identity);}
 @Post('fichas/:id/foto') @UseInterceptors(FileInterceptor('file',{limits:{fileSize:EVIDENCE_MAX_BYTES,files:1,fields:0}})) photo(@Param('id',ParseUUIDPipe) id:string,@UploadedFile() file:EvidenceFile|undefined,@Req() req:AuthRequest){return this.catalog.setTrackingPhoto(id,file,req.identity);}
 @Get('fichas/:id/foto') async photoRead(@Param('id',ParseUUIDPipe) id:string,@Res() res:Response){const photo=await this.catalog.trackingPhoto(id);res.setHeader('Content-Type',photo.mime);res.setHeader('Cache-Control','private, no-store');res.setHeader('X-Content-Type-Options','nosniff');res.send(photo.buffer);}
 @Get(':id') detail(@Param('id',ParseUUIDPipe) id:string){return this.catalog.part(id);}
 @Get(':id/historial') history(@Param('id',ParseUUIDPipe) id:string,@Query() q:PageDto){return this.catalog.history(id,q,'part');}
 @Post() create(@Body() dto:PartFieldsDto,@Req() req:AuthRequest){return this.catalog.createPart(dto,req.identity);}
 @Patch(':id') update(@Param('id',ParseUUIDPipe) id:string,@Body() dto:UpdatePartDto,@Req() req:AuthRequest){return this.catalog.updatePart(id,dto,req.identity);}
 @Patch(':id/activacion') active(@Param('id',ParseUUIDPipe) id:string,@Body() dto:CatalogActiveDto,@Req() req:AuthRequest){return this.catalog.active(id,dto,req.identity,'part');}
}
@Injectable()
export class SupplierGuard implements CanActivate {canActivate(c:ExecutionContext){if(c.switchToHttp().getRequest<AuthRequest>().identity.role!==Role.LOGISTICA)throw new ForbiddenException('Acceso de Logística requerido');return true;}}
@ApiTags('Proveedores') @ApiCookieAuth() @Controller('proveedores') @UseGuards(SessionGuard,SupplierGuard)
export class SuppliersController {
 constructor(private readonly catalog:CatalogService){}
 @Get() list(@Query() q:CatalogQueryDto){return this.catalog.suppliers(q);}
 @Get(':id') detail(@Param('id',ParseUUIDPipe) id:string){return this.catalog.supplier(id);}
 @Get(':id/historial') history(@Param('id',ParseUUIDPipe) id:string,@Query() q:PageDto){return this.catalog.history(id,q,'supplier');}
 @Post() create(@Body() dto:SupplierFieldsDto,@Req() req:AuthRequest){return this.catalog.createSupplier(dto,req.identity);}
 @Patch(':id') update(@Param('id',ParseUUIDPipe) id:string,@Body() dto:UpdateSupplierDto,@Req() req:AuthRequest){return this.catalog.updateSupplier(id,dto,req.identity);}
 @Patch(':id/activacion') active(@Param('id',ParseUUIDPipe) id:string,@Body() dto:CatalogActiveDto,@Req() req:AuthRequest){return this.catalog.active(id,dto,req.identity,'supplier');}
}
