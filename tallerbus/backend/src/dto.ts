import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength, Matches, ValidateIf } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
const trim = ({value}: {value: unknown}): unknown => typeof value === 'string' ? value.trim() : value;
const username = ({value}: {value: unknown}): unknown => typeof value === 'string' ? value.trim().toLowerCase() : value;
export class LoginDto {
  @ApiProperty() @Transform(username) @IsString() @Matches(/^[a-z0-9][a-z0-9._-]{2,39}$/) @MaxLength(40) username!: string;
  @ApiProperty({format:'password'}) @IsString() @MinLength(1) @MaxLength(128) password!: string;
}
export class CreateUserDto {
  @ApiProperty() @Transform(trim) @IsString() @MinLength(2) @MaxLength(100) @Matches(/\S/) name!: string;
  @ApiProperty() @Transform(username) @IsString() @Matches(/^[a-z0-9][a-z0-9._-]{2,39}$/) @MaxLength(40) username!: string;
  @ApiProperty({minLength:8, maxLength:128, format:'password'}) @IsString() @MinLength(8) @MaxLength(128) password!: string;
  @ApiProperty({enum:Role}) @IsEnum(Role) role!: Role;
}
export class UpdateUserDto {
  @ApiPropertyOptional() @ValidateIf((_o, value: unknown)=>value!==undefined) @Transform(trim) @IsString() @MinLength(2) @MaxLength(100) @Matches(/\S/) name?: string;
  @ApiPropertyOptional() @ValidateIf((_o, value: unknown)=>value!==undefined) @Transform(username) @IsString() @Matches(/^[a-z0-9][a-z0-9._-]{2,39}$/) @MaxLength(40) username?: string;
  @ApiPropertyOptional({enum:Role}) @ValidateIf((_o, value: unknown)=>value!==undefined) @IsEnum(Role) role?: Role;
  @ApiPropertyOptional() @ValidateIf((_o, value: unknown)=>value!==undefined) @IsBoolean() active?: boolean;
  @ApiProperty({minimum:1}) @IsInt() @Min(1) version!: number;
}
export class PageDto {
  @ApiPropertyOptional({default:1}) @IsOptional() @Type(()=>Number) @IsInt() @Min(1) @Max(100000) page = 1;
  @ApiPropertyOptional({default:20}) @IsOptional() @Type(()=>Number) @IsInt() @Min(1) @Max(100) limit = 20;
}
export class UserQueryDto extends PageDto {
  @ApiPropertyOptional() @IsOptional() @Transform(trim) @IsString() @MaxLength(100) search?: string;
  @ApiPropertyOptional({enum:Role}) @ValidateIf((_o, value: unknown)=>value!==undefined) @IsEnum(Role) role?: Role;
}
