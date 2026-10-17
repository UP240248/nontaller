import { Injectable, UnauthorizedException, HttpException, HttpStatus, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { hashPassword, hashToken, newToken, verifyPassword } from '../security';
import { settings } from '../config';
import { userFields } from '../guards';
@Injectable()
export class AuthService implements OnModuleInit {
  private dummyHash = '';
  private readonly attempts = new Map<string,{count:number;until:number}>();
  constructor(private readonly db: PrismaService) {}
  async onModuleInit() { this.dummyHash = await hashPassword(newToken()); }
  private rateLimit(ip: string): void {
    const now = Date.now();
    for (const [key, value] of this.attempts) if (value.until <= now) this.attempts.delete(key);
    const entry = this.attempts.get(ip) ?? {count:0,until:now+settings().loginWindowMs};
    if (entry.count >= settings().loginLimit || (!this.attempts.has(ip) && this.attempts.size >= 10000)) throw new HttpException('Demasiados intentos. Intenta más tarde.',HttpStatus.TOO_MANY_REQUESTS);
    entry.count++; this.attempts.set(ip,entry);
  }
  async login(email: string, password: string, ip: string) {
    this.rateLimit(ip);
    const user = await this.db.user.findUnique({where:{email}});
    const valid = await verifyPassword(user?.passwordHash ?? this.dummyHash, password);
    if (!user || !valid || !user.active) throw new UnauthorizedException('Correo o contraseña incorrectos');
    const token = newToken(); const expiresAt = new Date(Date.now()+settings().sessionHours*3600000);
    const result = await this.db.$transaction(async tx => {
      // Serializa con cambios de rol/activación y revocaciones, sin carreras con login.
      await tx.$queryRaw`SELECT id FROM AdminLock WHERE id = 1 FOR UPDATE`;
      const current = await tx.user.findUnique({where:{id:user.id}, select:userFields});
      if (!current?.active || current.version !== user.version) throw new UnauthorizedException('Vuelve a iniciar sesión');
      await tx.session.create({data:{userId:user.id,tokenHash:hashToken(token),expiresAt}});
      await tx.auditEvent.create({data:{actorId:user.id,entity:'Session',entityId:user.id,action:'LOGIN'}});
      return current;
    });
    return { token, expiresAt, user:result };
  }
  async logout(sessionId: string, userId: string): Promise<void> {
    await this.db.$transaction(async tx => {
      await tx.session.update({where:{id:sessionId},data:{revokedAt:new Date()}});
      await tx.auditEvent.create({data:{actorId:userId,entity:'Session',entityId:sessionId,action:'LOGOUT'}});
    });
  }
}
