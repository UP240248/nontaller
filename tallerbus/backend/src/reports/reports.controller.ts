import { Controller, Get, Header, Param, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthRequest, SessionGuard } from '../guards';
import { ReportQueryDto, ReportType } from './reports.dto';
import { ReportsService } from './reports.service';
@ApiTags('Reportes') @ApiCookieAuth() @Controller('reportes') @UseGuards(SessionGuard)
export class ReportsController {
 constructor(private readonly reports:ReportsService){}
 @Get('catalogo') @Header('Cache-Control','no-store') catalog(@Req() req:AuthRequest){return this.reports.catalog(req.identity);}
 @Get(':tipo/csv') async csv(@Param('tipo') tipo:ReportType,@Query() q:ReportQueryDto,@Req() req:AuthRequest,@Res() res:Response){const result=await this.reports.export(tipo,q,req.identity);res.setHeader('Content-Type','text/csv; charset=utf-8');res.setHeader('Content-Disposition','attachment; filename="tallerbus-'+tipo+'.csv"');res.setHeader('Cache-Control','no-store');res.setHeader('X-Total-Count',String(result.total));res.send(result.csv);}
 @Get(':tipo') report(@Param('tipo') tipo:ReportType,@Query() q:ReportQueryDto,@Req() req:AuthRequest,@Res({passthrough:true}) res:Response){res.setHeader('Cache-Control','no-store');return this.reports.report(tipo,q,req.identity);}
}
