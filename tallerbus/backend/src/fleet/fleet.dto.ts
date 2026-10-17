import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsIn, IsInt, IsString, Matches, Max, MaxLength, Min, MinLength, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { EstadoOperativo } from '@prisma/client';
import { PageDto } from '../dto';
const trim=({value}:{value:unknown})=>typeof value==='string'?value.trim():value;
export class BusFieldsDto {
 @ApiProperty() @Transform(({value}:{value:unknown})=>typeof value==='string'?value.trim().toUpperCase():value) @IsString() @Matches(/^[A-Z0-9][A-Z0-9 -]{0,29}$/) numeroEconomico!:string;
 @ApiProperty({description:'Se normaliza a mayúsculas, sin espacios ni guiones'}) @Transform(({value}:{value:unknown})=>typeof value==='string'?value.toUpperCase().replace(/[\s-]/g,''):value) @IsString() @Matches(/^[A-Z0-9]{2,16}$/) placas!:string;
 @ApiProperty() @Transform(trim) @IsString() @MinLength(2) @MaxLength(80) @Matches(/\S/) marca!:string;
 @ApiProperty() @Transform(trim) @IsString() @MinLength(1) @MaxLength(80) @Matches(/\S/) modelo!:string;
 @ApiProperty({minimum:0,maximum:2147483647}) @IsInt() @Min(0) @Max(2147483647) kilometraje!:number;
}
export class CreateBusDto extends BusFieldsDto {
 @ApiProperty({enum:EstadoOperativo}) @IsEnum(EstadoOperativo) estadoOperativo!:EstadoOperativo;
}
export class VersionDto {
 @ApiProperty({minimum:1}) @IsInt() @Min(1) version!:number;
 @ApiProperty() @Transform(trim) @IsString() @MinLength(3) @MaxLength(500) motivo!:string;
}
export class UpdateBusDto extends PartialType(BusFieldsDto,{skipNullProperties:false}) {
 @ApiProperty({minimum:1}) @IsInt() @Min(1) version!:number;
 @ApiProperty() @Transform(trim) @IsString() @MinLength(3) @MaxLength(500) motivo!:string;
}
export class BusStateDto extends VersionDto {
 @ApiProperty({enum:EstadoOperativo}) @IsEnum(EstadoOperativo) estadoOperativo!:EstadoOperativo;
}
export class BusActiveDto extends VersionDto {
 @ApiProperty() @IsBoolean() activo!:boolean;
}
export class BusQueryDto extends PageDto {
 @ApiPropertyOptional() @ValidateIf((_o,value:unknown)=>value!==undefined) @Transform(trim) @IsString() @MaxLength(100) search?:string;
 @ApiPropertyOptional({enum:EstadoOperativo}) @ValidateIf((_o,value:unknown)=>value!==undefined) @IsEnum(EstadoOperativo) estadoOperativo?:EstadoOperativo;
 @ApiPropertyOptional({enum:['true','false']}) @ValidateIf((_o,value:unknown)=>value!==undefined) @IsIn(['true','false']) activo?:string;
 @ApiPropertyOptional({enum:['numeroEconomico','placas','kilometraje','createdAt']}) @IsIn(['numeroEconomico','placas','kilometraje','createdAt']) sort='numeroEconomico';
 @ApiPropertyOptional({enum:['asc','desc']}) @IsIn(['asc','desc']) direction:'asc'|'desc'='asc';
}
