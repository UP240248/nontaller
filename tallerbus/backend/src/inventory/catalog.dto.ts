import { Transform } from 'class-transformer';
import { IsBoolean, IsUUID, IsEmail, IsIn, IsInt, IsOptional, IsString, Matches, MaxLength, Min, MinLength, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { PageDto } from '../dto';
const trim=({value}:{value:unknown})=>typeof value==='string'?value.trim():value;
const optional=({value}:{value:unknown})=>typeof value==='string'?(value.trim()||null):value;
const code=({value}:{value:unknown})=>typeof value==='string'?value.trim().toUpperCase():value;
export class PartFieldsDto {
 @ApiProperty() @Transform(code) @IsString() @Matches(/^[A-Z0-9][A-Z0-9._-]{0,39}$/) sku!:string;
 @ApiProperty() @Transform(trim) @IsString() @MinLength(3) @MaxLength(200) descripcion!:string;
 @ApiProperty() @Transform(trim) @IsString() @MinLength(1) @MaxLength(30) unidad!:string;
 @ApiPropertyOptional({nullable:true}) @Transform(optional) @IsOptional() @IsString() @MaxLength(60) categoria?:string|null;
 @ApiProperty({description:'Cadena decimal no negativa, hasta 3 decimales'}) @IsString() @Matches(/^(?:0|[1-9]\d{0,8})(?:\.\d{1,3})?$/) minimo!:string;
}
export class SupplierFieldsDto {
 @ApiProperty() @Transform(code) @IsString() @Matches(/^[A-Z0-9][A-Z0-9._-]{0,39}$/) codigo!:string;
 @ApiProperty() @Transform(trim) @IsString() @MinLength(2) @MaxLength(120) nombre!:string;
 @ApiPropertyOptional({nullable:true}) @Transform(optional) @IsOptional() @IsString() @MaxLength(100) contacto?:string|null;
 @ApiPropertyOptional({nullable:true}) @Transform(({value}:{value:unknown})=>typeof value==='string'?(value.trim().toLowerCase()||null):value) @IsOptional() @IsEmail() @MaxLength(190) email?:string|null;
 @ApiPropertyOptional({nullable:true}) @Transform(optional) @IsOptional() @IsString() @Matches(/^[+()0-9 .-]{5,30}$/) telefono?:string|null;
}
export class CatalogVersionDto {
 @ApiProperty() @IsInt() @Min(1) version!:number;
 @ApiProperty() @Transform(trim) @IsString() @MinLength(3) @MaxLength(500) motivo!:string;
}
export class UpdatePartDto extends PartialType(PartFieldsDto,{skipNullProperties:false}) {
 @ApiProperty() @IsInt() @Min(1) version!:number;
 @ApiProperty() @Transform(trim) @IsString() @MinLength(3) @MaxLength(500) motivo!:string;
}
export class UpdateSupplierDto extends PartialType(SupplierFieldsDto,{skipNullProperties:false}) {
 @ApiProperty() @IsInt() @Min(1) version!:number;
 @ApiProperty() @Transform(trim) @IsString() @MinLength(3) @MaxLength(500) motivo!:string;
}
export class CatalogActiveDto extends CatalogVersionDto {
 @ApiProperty() @IsBoolean() activo!:boolean;
}
export class CatalogQueryDto extends PageDto {
 @ApiPropertyOptional() @ValidateIf((_o,value:unknown)=>value!==undefined) @Transform(trim) @IsString() @MaxLength(100) search?:string;
 @ApiPropertyOptional({enum:['true','false']}) @ValidateIf((_o,value:unknown)=>value!==undefined) @IsIn(['true','false']) activo?:string;
}

export class PartTrackingDto {
 @IsUUID() refaccionId!:string;
 @Transform(trim) @IsString() @MinLength(1) @MaxLength(80) identificador!:string;
 @Transform(trim) @IsString() @MinLength(1) @MaxLength(200) condicion!:string;
 @IsIn(['PENDIENTE','DISPONIBLE','EN_USO','RETIRADA']) situacion!:string;
 @Transform(optional) @IsOptional() @IsString() @MaxLength(40) unidad?:string|null;
 @IsOptional() @IsString() @Matches(/^(?:0|[1-9]\d{0,8})(?:\.\d{1,6})?$/) costoAproximado?:string|null;
 @Transform(optional) @IsOptional() @IsString() @MaxLength(1000) notas?:string|null;
 @IsOptional() @IsInt() @Min(1) version?:number;
}
