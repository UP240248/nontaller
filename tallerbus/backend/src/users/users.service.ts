import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from '../dto';
import { userFields } from '../guards';
import { hashPassword } from '../security';
@Injectable()
export class UsersService {
  constructor(private readonly db: PrismaService) {}
  private async authorize(tx: Prisma.TransactionClient, actorId: string) {
    await tx.$queryRaw`SELECT id FROM AdminLock WHERE id = 1 FOR UPDATE`;
    const actor = await tx.user.findUnique({where:{id:actorId},select:{role:true,active:true}});
    if (!actor?.active || actor.role !== Role.ADMINISTRACION) throw new ForbiddenException('Permiso de Administración requerido');
  }
  async list(query: UserQueryDto) {
    const where: Prisma.UserWhereInput = { ...(query.role ? {role:query.role}:{}), ...(query.search ? {OR:[{name:{contains:query.search}},{email:{contains:query.search}}]}:{}) };
    const [data,total] = await this.db.$transaction([
      this.db.user.findMany({where, select:userFields, skip:(query.page-1)*query.limit,take:query.limit,orderBy:[{createdAt:'desc'},{id:'desc'}]}),
      this.db.user.count({where})
    ]);
    return {data,total,page:query.page,limit:query.limit};
  }
  async create(input: CreateUserDto, actorId: string) {
    const passwordHash = await hashPassword(input.password);
    return this.db.$transaction(async tx => {
      await this.authorize(tx,actorId);
      const user = await tx.user.create({data:{name:input.name,email:input.email,role:input.role,passwordHash},select:userFields});
      await tx.auditEvent.create({data:{actorId,entity:'User',entityId:user.id,action:'CREATE',changes:{after:user}}});
      return user;
    });
  }
  async update(id: string, input: UpdateUserDto, actorId: string) {
    return this.db.$transaction(async tx => {
      await this.authorize(tx,actorId);
      const before = await tx.user.findUnique({where:{id},select:userFields});
      if (!before) throw new NotFoundException('Usuario no encontrado');
      if (before.version !== input.version) throw new ConflictException('El usuario cambió; actualiza la lista');
      const removingAdmin = before.active && before.role === Role.ADMINISTRACION && (input.active === false || (input.role !== undefined && input.role !== Role.ADMINISTRACION));
      if (removingAdmin && await tx.user.count({where:{role:Role.ADMINISTRACION,active:true}}) <= 1) throw new ConflictException('Debe existir al menos un administrador activo');
      const {version: _version, ...patch} = input;
      void _version;
      const after = await tx.user.update({where:{id},data:{...patch,version:{increment:1}},select:userFields});
      if (!after.active || after.role !== before.role) await tx.session.updateMany({where:{userId:id,revokedAt:null},data:{revokedAt:new Date()}});
      await tx.auditEvent.create({data:{actorId,entity:'User',entityId:id,action:'UPDATE',changes:{before,after}}});
      return after;
    });
  }
  async revoke(id: string, actorId: string) {
    return this.db.$transaction(async tx => {
      await this.authorize(tx,actorId);
      if (!await tx.user.findUnique({where:{id},select:{id:true}})) throw new NotFoundException('Usuario no encontrado');
      const {count} = await tx.session.updateMany({where:{userId:id,revokedAt:null,expiresAt:{gt:new Date()}},data:{revokedAt:new Date()}});
      await tx.auditEvent.create({data:{actorId,entity:'User',entityId:id,action:'REVOKE_SESSIONS',changes:{count}}});
      return {revoked:count};
    });
  }
}
