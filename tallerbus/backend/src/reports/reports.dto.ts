import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsISO8601, IsString, IsUUID, MaxLength, ValidateIf } from 'class-validator';
import { PageDto } from '../dto';
export const reportTypes=['flota','fallas','ordenes','preventivos','compras','inventario','costos'] as const;
export type ReportType=typeof reportTypes[number];
export class ReportQueryDto extends PageDto {
 @ApiPropertyOptional() @ValidateIf((_o,v:unknown)=>v!==undefined) @Transform(({value}:{value:unknown})=>typeof value==='string'?value.trim():value) @IsString() @MaxLength(100) search?:string;
 @ApiPropertyOptional() @ValidateIf((_o,v:unknown)=>v!==undefined) @IsUUID() autobusId?:string;
 @ApiPropertyOptional() @ValidateIf((_o,v:unknown)=>v!==undefined) @IsUUID() mecanicoId?:string;
 @ApiPropertyOptional() @ValidateIf((_o,v:unknown)=>v!==undefined) @IsUUID() refaccionId?:string;
 @ApiPropertyOptional() @ValidateIf((_o,v:unknown)=>v!==undefined) @IsUUID() proveedorId?:string;
 @ApiPropertyOptional({format:'date-time'}) @ValidateIf((_o,v:unknown)=>v!==undefined) @IsISO8601({strict:true}) desde?:string;
 @ApiPropertyOptional({format:'date-time'}) @ValidateIf((_o,v:unknown)=>v!==undefined) @IsISO8601({strict:true}) hasta?:string;
 @ApiPropertyOptional() @ValidateIf((_o,v:unknown)=>v!==undefined) @IsString() @MaxLength(40) estado?:string;
 @ApiPropertyOptional() @ValidateIf((_o,v:unknown)=>v!==undefined) @IsIn(['BAJA','MEDIA','ALTA','CRITICA']) prioridad?:'BAJA'|'MEDIA'|'ALTA'|'CRITICA';
 @ApiPropertyOptional() @ValidateIf((_o,v:unknown)=>v!==undefined) @IsIn(['true','false']) activo?:string;
 @ApiPropertyOptional() @ValidateIf((_o,v:unknown)=>v!==undefined) @IsIn(['true','false']) vencido?:string;
}
