import { Body, CanActivate, Controller, ExecutionContext, ForbiddenException, Get, Injectable, Param, ParseUUIDPipe, Patch, Post, Query, Req, StreamableFile, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AuthRequest, SessionGuard } from '../guards';
import { PageDto } from '../dto';
import { CreateIncidentDto, EvaluateIncidentDto, IncidentQueryDto } from './incidents.dto';
import { incidentReaders, IncidentsService } from './incidents.service';
import { EvidenceFile, EvidenceService, EVIDENCE_MAX_BYTES } from './evidence.service';
@Injectable()
export class IncidentGuard implements CanActivate {
 canActivate(context:ExecutionContext){if(!incidentReaders.includes(context.switchToHttp().getRequest<AuthRequest>().identity.role))throw new ForbiddenException('Acceso a fallas no autorizado');return true;}
}
@ApiTags('Fallas') @ApiCookieAuth() @Controller('fallas') @UseGuards(SessionGuard,IncidentGuard)
export class IncidentsController {
 constructor(private readonly incidents:IncidentsService,private readonly evidence:EvidenceService){}
 @Get('metricas') metrics(@Req() req:AuthRequest){return this.incidents.metrics(req.identity);}
 @Get() list(@Query() q:IncidentQueryDto,@Req() req:AuthRequest){return this.incidents.list(q,req.identity);}
 @Post() create(@Body() dto:CreateIncidentDto,@Req() req:AuthRequest){return this.incidents.create(dto,req.identity);}
 @Get(':id') detail(@Param('id',ParseUUIDPipe) id:string,@Req() req:AuthRequest){return this.incidents.detail(id,req.identity);}
 @Patch(':id/evaluacion') evaluate(@Param('id',ParseUUIDPipe) id:string,@Body() dto:EvaluateIncidentDto,@Req() req:AuthRequest){return this.incidents.evaluate(id,dto,req.identity);}
 @Get(':id/historial') history(@Param('id',ParseUUIDPipe) id:string,@Query() q:PageDto,@Req() req:AuthRequest){return this.incidents.history(id,q,req.identity);}
 @Post(':id/evidencias') @UseInterceptors(FileInterceptor('file',{limits:{fileSize:EVIDENCE_MAX_BYTES,files:1,fields:0}}))
 @ApiConsumes('multipart/form-data') @ApiBody({schema:{type:'object',required:['file'],properties:{file:{type:'string',format:'binary'}}}})
 upload(@Param('id',ParseUUIDPipe) id:string,@UploadedFile() file:EvidenceFile|undefined,@Req() req:AuthRequest){return this.evidence.upload(id,file,req.identity);}
 @Get(':id/evidencias/:evidenceId')
 async download(@Param('id',ParseUUIDPipe) id:string,@Param('evidenceId',ParseUUIDPipe) evidenceId:string,@Req() req:AuthRequest){const file=await this.evidence.download(id,evidenceId,req.identity);return new StreamableFile(file.buffer,{type:file.mime,disposition:`attachment; filename="${file.filename}"`});}
}
