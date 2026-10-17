import { Body, Controller, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard, AuthRequest, SessionGuard } from '../guards';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from '../dto';
import { UsersService } from './users.service';
@ApiTags('Usuarios') @ApiCookieAuth() @Controller('users') @UseGuards(SessionGuard,AdminGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}
  @Get() list(@Query() q: UserQueryDto) { return this.users.list(q); }
  @Post() create(@Body() dto: CreateUserDto, @Req() req: AuthRequest) { return this.users.create(dto,req.identity.id); }
  @Patch(':id') update(@Param('id',ParseUUIDPipe) id: string,@Body() dto: UpdateUserDto,@Req() req: AuthRequest) { return this.users.update(id,dto,req.identity.id); }
  @Post(':id/revoke-sessions') @HttpCode(200)
  revoke(@Param('id',ParseUUIDPipe) id: string,@Req() req: AuthRequest) { return this.users.revoke(id,req.identity.id); }
}
