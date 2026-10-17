import { Transform } from 'class-transformer';
import { IsEnum, IsISO8601, IsInt, IsIn, IsString, IsUUID, Matches, MaxLength, Min, MinLength, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoFalla, PrioridadFalla } from '@prisma/client';
import { PageDto } from '../dto';
const trim=({value}:{value:unknown})=>typeof value==='string'?value.trim():value;
export class CreateIncidentDto {
 @ApiProperty({description:'Número económico conocido de unidad activa'}) @Transform(({value}:{value:unknown})=>typeof value==='string'?value.trim().toUpperCase():value) @IsString() @Matches(/^[A-Z0-9][A-Z0-9 -]{0,29}$/) numeroEconomico!:string;
 @ApiProperty() @Transform(trim) @IsString() @MinLength(10) @MaxLength(2000) descripcion!:string;
 @ApiProperty() @Transform(trim) @IsString() @MinLength(2) @MaxLength(60) tipo!:string;
}
export class EvaluateIncidentDto {
 @ApiProperty() @IsInt() @Min(1) version!:number;
 @ApiProperty({enum:PrioridadFalla}) @IsEnum(PrioridadFalla) prioridad!:PrioridadFalla;
 @ApiProperty() @Transform(trim) @IsString() @MinLength(10) @MaxLength(2000) evaluacion!:string;
 @ApiProperty() @Transform(trim) @IsString() @MinLength(3) @MaxLength(500) motivo!:string;
}
export class IncidentQueryDto extends PageDto {
 @ApiPropertyOptional() @ValidateIf((_o,value:unknown)=>value!==undefined) @IsUUID() mecanicoId?:string;

 @ApiPropertyOptional() @ValidateIf((_o,value:unknown)=>value!==undefined) @Transform(({value}:{value:unknown})=>typeof value==='string'?value.trim().toUpperCase():value) @IsString() @MaxLength(30) numeroEconomico?:string;
 @ApiPropertyOptional({enum:['true','false']}) @ValidateIf((_o,value:unknown)=>value!==undefined) @IsIn(['true','false']) sinOrden?:string;

 @ApiPropertyOptional() @ValidateIf((_o,value:unknown)=>value!==undefined) @Transform(trim) @IsString() @MaxLength(100) search?:string;
 @ApiPropertyOptional() @ValidateIf((_o,value:unknown)=>value!==undefined) @IsUUID() autobusId?:string;
 @ApiPropertyOptional({enum:EstadoFalla}) @ValidateIf((_o,value:unknown)=>value!==undefined) @IsEnum(EstadoFalla) estado?:EstadoFalla;
 @ApiPropertyOptional({enum:PrioridadFalla}) @ValidateIf((_o,value:unknown)=>value!==undefined) @IsEnum(PrioridadFalla) prioridad?:PrioridadFalla;
 @ApiPropertyOptional() @ValidateIf((_o,value:unknown)=>value!==undefined) @Transform(trim) @IsString() @MaxLength(60) tipo?:string;
 @ApiPropertyOptional({format:'date-time'}) @ValidateIf((_o,value:unknown)=>value!==undefined) @IsISO8601({strict:true}) desde?:string;
 @ApiPropertyOptional({format:'date-time'}) @ValidateIf((_o,value:unknown)=>value!==undefined) @IsISO8601({strict:true}) hasta?:string;
}
