import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray, IsEnum, IsIn, IsInt, IsOptional, IsString, IsUUID, Matches, MaxLength, Min, MinLength, ValidateNested } from 'class-validator';
import { TipoMovimiento } from '@prisma/client';
import { PageDto } from '../dto';
export class OperationDto {
 @ApiProperty() @IsUUID('4') operacionId!:string;
 @ApiProperty() @Transform(({value}:{value:unknown})=>typeof value==='string'?value.trim():value) @IsString() @MinLength(3) @MaxLength(500) motivo!:string;
}
export class QuantityDto {
 @ApiProperty() @IsString() @Matches(/^(?:0|[1-9]\d{0,8})(?:\.\d{1,3})?$/) cantidad!:string;
}
export class StockEntryDto extends OperationDto {
 @ApiProperty() @IsUUID() refaccionId!:string;
 @ApiProperty() @IsString() @Matches(/^(?:0|[1-9]\d{0,8})(?:\.\d{1,3})?$/) cantidad!:string;
 @ApiProperty() @IsString() @Matches(/^(?:0|[1-9]\d{0,8})(?:\.\d{1,6})?$/) costoUnitario!:string;
}
export class StockIssueDto extends OperationDto {
 @ApiProperty() @IsUUID() refaccionId!:string;
 @ApiProperty() @IsUUID() ordenId!:string;
 @ApiProperty() @IsString() @Matches(/^(?:0|[1-9]\d{0,8})(?:\.\d{1,3})?$/) cantidad!:string;
}
export class StockReturnDto extends OperationDto {
 @ApiProperty() @IsUUID() origenId!:string;
 @ApiProperty() @IsString() @Matches(/^(?:0|[1-9]\d{0,8})(?:\.\d{1,3})?$/) cantidad!:string;
}
export class StockAdjustmentDto extends OperationDto {
 @ApiProperty() @IsUUID() refaccionId!:string;
 @ApiProperty() @IsString() @Matches(/^-?(?:0|[1-9]\d{0,8})(?:\.\d{1,3})?$/) cantidad!:string;
}
export class PurchaseLineDto extends QuantityDto {
 @ApiProperty() @IsUUID() refaccionId!:string;
 @ApiProperty() @IsString() @Matches(/^(?:0|[1-9]\d{0,8})(?:\.\d{1,6})?$/) costoUnitario!:string;
}
export class PurchaseDto extends OperationDto {
 @ApiProperty() @IsUUID() proveedorId!:string;
 @ApiProperty() @Transform(({value}:{value:unknown})=>typeof value==='string'?value.trim():value) @IsString() @MinLength(1) @MaxLength(100) referencia!:string;
 @ApiProperty() @IsArray() @ArrayMinSize(1) @ArrayMaxSize(50) @ArrayUnique((l:PurchaseLineDto)=>l.refaccionId) @ValidateNested({each:true}) @Type(()=>PurchaseLineDto) lineas!:PurchaseLineDto[];
}
export class PurchaseActionDto extends OperationDto {
 @ApiProperty() @IsInt() @Min(1) version!:number;
}
export class ReceiptLineDto extends QuantityDto {@ApiProperty() @IsUUID() lineaId!:string;}
export class ReceiptDto extends PurchaseActionDto {
 @ApiProperty() @IsArray() @ArrayMinSize(1) @ArrayMaxSize(50) @ArrayUnique((l:ReceiptLineDto)=>l.lineaId) @ValidateNested({each:true}) @Type(()=>ReceiptLineDto) lineas!:ReceiptLineDto[];
}
export class StockQueryDto extends PageDto {
 @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100) search?:string;
 @ApiPropertyOptional() @IsOptional() @IsUUID() refaccionId?:string;
 @ApiPropertyOptional() @IsOptional() @IsUUID() ordenId?:string;
}
export class MovementQueryDto extends StockQueryDto {
 @ApiPropertyOptional({enum:TipoMovimiento}) @IsOptional() @IsEnum(TipoMovimiento) tipo?:TipoMovimiento;
}
export class PurchaseQueryDto extends PageDto {
 @ApiPropertyOptional() @IsOptional() @IsIn(['BORRADOR','APROBADA','PARCIAL','RECIBIDA','CANCELADA']) estado?:'BORRADOR'|'APROBADA'|'PARCIAL'|'RECIBIDA'|'CANCELADA';
}
