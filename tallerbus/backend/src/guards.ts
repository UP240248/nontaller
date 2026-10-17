import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Role } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { COOKIE, csrfToken, equalToken, hashToken } from './security';
import { settings } from './config';
export interface Identity { id: string; name: string; email: string; role: Role; active: boolean; version: number }
export interface AuthRequest extends Request { identity: Identity; sessionId: string; sessionToken: string }
export const userFields = { id:true, name:true, email:true, role:true, active:true, version:true } as const;
@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly db: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthRequest>();
    const token: unknown = req.cookies?.[COOKIE];
    if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) throw new UnauthorizedException('Sesión requerida');
    const session = await this.db.session.findUnique({where:{tokenHash:hashToken(token)}, include:{user:{select:userFields}}});
    if (!session || session.revokedAt || session.expiresAt <= new Date() || !session.user.active) throw new UnauthorizedException('Sesión inválida o vencida');
    if (!['GET','HEAD','OPTIONS'].includes(req.method)) {
      const csrf = req.get('X-CSRF-Token') ?? '';
      if (req.get('Origin') !== settings().origin || !/^[a-f0-9]{64}$/.test(csrf) || !equalToken(csrf,csrfToken(token))) throw new ForbiddenException('Solicitud no autorizada');
    }
    req.identity = session.user; req.sessionId = session.id; req.sessionToken = token;
    return true;
  }
}
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (context.switchToHttp().getRequest<AuthRequest>().identity?.role !== Role.ADMINISTRACION) throw new ForbiddenException('Permiso de Administración requerido');
    return true;
  }
}
