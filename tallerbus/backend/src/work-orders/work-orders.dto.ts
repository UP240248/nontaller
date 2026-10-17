import { Transform, Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray, IsBoolean, IsEnum, IsInt, IsISO8601, IsString, IsUUID, Matches, Max, MaxLength, Min, MinLength, ValidateIf, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoOrden } from '@prisma/client';
import { PageDto } from '../dto';
const trim=({value}:{value:unknown})=>typeof value==='string'?value.trim():value;
export class CreateOrderDto {
 @ApiProperty() @Transform(trim) @IsString() @MinLength(3) @MaxLength(120) titulo!:string;
 @ApiProperty({type:[String]}) @IsArray() @ArrayMinSize(1) @ArrayMaxSize(100) @ArrayUnique() @IsUUID(undefined,{each:true}) fallaIds!:string[];
}
export class OrderVersionDto {
 @ApiProperty() @IsInt() @Min(1) version!:number;
 @ApiProperty() @Transform(trim) @IsString() @MinLength(3) @MaxLength(500) motivo!:string;
}
export class AssignOrderDto extends OrderVersionDto {
 @ApiProperty({type:[String]}) @IsArray() @ArrayMinSize(1) @ArrayMaxSize(100) @ArrayUnique() @IsUUID(undefined,{each:true}) mecanicoIds!:string[];
}
export class StartOrderDto extends OrderVersionDto {
 @ApiProperty() @Transform(trim) @IsString() @MinLength(10) @MaxLength(2000) diagnostico!:string;
}
export class WaitOrderDto extends OrderVersionDto {
 @ApiProperty() @IsBoolean() esperaRefacciones!:boolean;
}
export class RepairPartDto {
 @ApiProperty() @Transform(trim) @IsString() @MinLength(2) @MaxLength(200) descripcion!:string;
 @ApiProperty({description:'Cadena decimal positiva, hasta 9 enteros y 3 decimales'}) @IsString() @Matches(/^(?:0|[1-9]\d{0,8})(?:\.\d{1,3})?$/) cantidad!:string;
 @ApiProperty() @Transform(trim) @IsString() @MinLength(1) @MaxLength(30) unidad!:string;
}
export class FinishOrderDto extends OrderVersionDto {
 @ApiProperty() @Transform(trim) @IsString() @MinLength(10) @MaxLength(2000) trabajoRealizado!:string;
 @ApiProperty() @Transform(trim) @IsString() @MinLength(3) @MaxLength(2000) observaciones!:string;
 @ApiProperty() @IsBoolean() aplicoManoObra!:boolean;
 @ApiProperty() @IsInt() @Min(0) @Max(1000000) manoObraMinutos!:number;
 @ApiProperty() @IsBoolean() aplicaronRefacciones!:boolean;
 @ApiProperty({type:[RepairPartDto]}) @IsArray() @ArrayMaxSize(100) @ValidateNested({each:true}) @Type(()=>RepairPartDto) refacciones!:RepairPartDto[];
}
export class OrderQueryDto extends PageDto {
 @ApiPropertyOptional() @ValidateIf((_o,value:unknown)=>value!==undefined) @IsUUID() mecanicoId?:string;
 @ApiPropertyOptional({format:'date-time'}) @ValidateIf((_o,value:unknown)=>value!==undefined) @IsISO8601({strict:true}) desde?:string;
 @ApiPropertyOptional({format:'date-time'}) @ValidateIf((_o,value:unknown)=>value!==undefined) @IsISO8601({strict:true}) hasta?:string;

 @ApiPropertyOptional({enum:EstadoOrden}) @ValidateIf((_o,value:unknown)=>value!==undefined) @IsEnum(EstadoOrden) estado?:EstadoOrden;
 @ApiPropertyOptional() @ValidateIf((_o,value:unknown)=>value!==undefined) @IsUUID() autobusId?:string;
 @ApiPropertyOptional() @ValidateIf((_o,value:unknown)=>value!==undefined) @Transform(trim) @IsString() @MaxLength(100) search?:string;
}
