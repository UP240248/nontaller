import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards, ForbiddenException, Header } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthRequest, SessionGuard } from '../guards';
import { LoginDto } from '../dto';
import { COOKIE, csrfToken } from '../security';
import { settings } from '../config';
@ApiTags('Sesiones') @Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}
  @Post('login') @HttpCode(200) @Header('Cache-Control','no-store')
  @ApiOperation({summary:'Iniciar sesión; devuelve token CSRF, nunca el token de sesión'})
  async login(@Body() input: LoginDto, @Req() req: Request, @Res({passthrough:true}) res: Response) {
    if (req.get('Origin') !== settings().origin) throw new ForbiddenException('Origen no autorizado');
    const result = await this.auth.login(input.email,input.password,req.ip ?? 'unknown');
    res.cookie(COOKIE,result.token,{httpOnly:true,sameSite:'strict',secure:settings().secure,path:'/api',expires:result.expiresAt});
    return {user:result.user,csrfToken:csrfToken(result.token)};
  }
  @Get('me') @UseGuards(SessionGuard) @ApiCookieAuth() @Header('Cache-Control','no-store')
  me(@Req() req: AuthRequest) { return {user:req.identity,csrfToken:csrfToken(req.sessionToken)}; }
  @Post('logout') @HttpCode(204) @UseGuards(SessionGuard) @ApiCookieAuth()
  async logout(@Req() req: AuthRequest, @Res({passthrough:true}) res: Response) {
    await this.auth.logout(req.sessionId,req.identity.id);
    res.clearCookie(COOKIE,{httpOnly:true,sameSite:'strict',secure:settings().secure,path:'/api'});
  }
}
