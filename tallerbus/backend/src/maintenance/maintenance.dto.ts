import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray, IsBoolean, IsIn, IsInt, IsString, IsUUID, Max, MaxLength, Min, MinLength, ValidateIf, ValidateNested } from 'class-validator';
import { PageDto } from '../dto';
import { OrderVersionDto } from '../work-orders/work-orders.dto';
const trim=({value}:{value:unknown})=>typeof value==='string'?value.trim():value;
export class PlanFieldsDto {
 @ApiProperty() @Transform(trim) @IsString() @MinLength(3) @MaxLength(100) nombre!:string;
 @ApiProperty() @IsInt() @Min(1) @Max(10000000) intervaloKm!:number;
 @ApiProperty({type:[String]}) @Transform(({value}:{value:unknown})=>Array.isArray(value)?value.map(v=>typeof v==='string'?v.trim():v):value) @IsArray() @ArrayMinSize(1) @ArrayMaxSize(50) @ArrayUnique() @IsString({each:true}) @MinLength(3,{each:true}) @MaxLength(200,{each:true}) checklist!:string[];
}
export class CreatePlanDto extends PlanFieldsDto {
 @ApiProperty() @IsUUID() autobusId!:string;
 @ApiProperty() @IsInt() @Min(0) @Max(2147483647) ultimoServicioKm!:number;
}
export class UpdatePlanDto extends PlanFieldsDto {
 @ApiProperty() @IsInt() @Min(1) version!:number;
 @ApiProperty() @Transform(trim) @IsString() @MinLength(3) @MaxLength(500) motivo!:string;
}
export class ActivePlanDto extends OrderVersionDto {@ApiProperty() @IsBoolean() activo!:boolean;}
export class SchedulePlanDto extends OrderVersionDto {
 @ApiProperty({type:[String]}) @IsArray() @ArrayMinSize(1) @ArrayMaxSize(100) @ArrayUnique() @IsUUID(undefined,{each:true}) mecanicoIds!:string[];
}
export class StepDto {
 @ApiProperty() @IsUUID() id!:string;
 @ApiProperty() @IsBoolean() completado!:boolean;
 @ApiProperty() @Transform(trim) @IsString() @MaxLength(500) observaciones!:string;
}
export class ChecklistDto extends OrderVersionDto {
 @ApiProperty({type:[StepDto]}) @IsArray() @ArrayMinSize(1) @ArrayMaxSize(50) @ArrayUnique((s:StepDto)=>s.id) @ValidateNested({each:true}) @Type(()=>StepDto) pasos!:StepDto[];
}
export class PlanQueryDto extends PageDto {
 @ApiPropertyOptional() @ValidateIf((_o,v:unknown)=>v!==undefined) @IsUUID() autobusId?:string;
 @ApiPropertyOptional() @ValidateIf((_o,v:unknown)=>v!==undefined) @Transform(trim) @IsString() @MaxLength(100) search?:string;
 @ApiPropertyOptional({enum:['true','false']}) @ValidateIf((_o,v:unknown)=>v!==undefined) @IsIn(['true','false']) activo?:string;
 @ApiPropertyOptional({enum:['true','false']}) @ValidateIf((_o,v:unknown)=>v!==undefined) @IsIn(['true','false']) vencido?:string;
}
