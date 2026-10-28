import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AuthRequest, SessionGuard } from '../guards';
import { CatalogGuard, SupplierGuard } from './catalog.controller';
import { StockService } from './stock.service';
import { MovementQueryDto, PurchaseActionDto, PurchaseDto, PurchaseQueryDto, ReceiptDto, StockAdjustmentDto, StockEntryDto, StockIssueDto, StockQueryDto, StockReturnDto } from './stock.dto';
@ApiTags('Inventario') @ApiCookieAuth() @Controller('inventario') @UseGuards(SessionGuard,CatalogGuard)
export class StockController {
 constructor(private readonly stock:StockService){}
 @Get('existencias') balances(@Query() q:StockQueryDto,@Req() req:AuthRequest){return this.stock.balances(q,req.identity.role==='LOGISTICA');}
 @Get('movimientos') @UseGuards(SupplierGuard) movements(@Query() q:MovementQueryDto){return this.stock.movements(q);}
 @Get('ordenes/:id/materiales') materials(@Param('id',ParseUUIDPipe) id:string){return this.stock.orderMaterials(id);}
 @Get('ordenes/:id/costo') @UseGuards(SupplierGuard) cost(@Param('id',ParseUUIDPipe) id:string){return this.stock.orderCost(id);}
 @Post('entradas') @UseGuards(SupplierGuard) entry(@Body() dto:StockEntryDto,@Req() req:AuthRequest){return this.stock.entry(dto,req.identity);}
 @Post('entregas') @UseGuards(SupplierGuard) issue(@Body() dto:StockIssueDto,@Req() req:AuthRequest){return this.stock.issue(dto,req.identity);}
 @Post('devoluciones') @UseGuards(SupplierGuard) returns(@Body() dto:StockReturnDto,@Req() req:AuthRequest){return this.stock.returnStock(dto,req.identity);}
 @Post('ajustes') @UseGuards(SupplierGuard) adjustment(@Body() dto:StockAdjustmentDto,@Req() req:AuthRequest){return this.stock.adjustment(dto,req.identity);}
}
@ApiTags('Compras') @ApiCookieAuth() @Controller('compras') @UseGuards(SessionGuard,SupplierGuard)
export class PurchaseController {
 constructor(private readonly stock:StockService){}
 @Get() list(@Query() q:PurchaseQueryDto){return this.stock.purchases(q);}
 @Get(':id') detail(@Param('id',ParseUUIDPipe) id:string){return this.stock.purchaseDetail(id);}
 @Post() create(@Body() dto:PurchaseDto,@Req() req:AuthRequest){return this.stock.createPurchase(dto,req.identity);}
 @Post(':id/aprobar') approve(@Param('id',ParseUUIDPipe) id:string,@Body() dto:PurchaseActionDto,@Req() req:AuthRequest){return this.stock.approve(id,dto,req.identity);}
 @Post(':id/cancelar') cancel(@Param('id',ParseUUIDPipe) id:string,@Body() dto:PurchaseActionDto,@Req() req:AuthRequest){return this.stock.cancel(id,dto,req.identity);}
 @Post(':id/recepciones') receive(@Param('id',ParseUUIDPipe) id:string,@Body() dto:ReceiptDto,@Req() req:AuthRequest){return this.stock.receive(id,dto,req.identity);}
}
