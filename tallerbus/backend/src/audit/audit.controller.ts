import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard, SessionGuard } from '../guards';
import { PageDto } from '../dto';
import { PrismaService } from '../prisma.service';
@ApiTags('Auditoría') @ApiCookieAuth() @Controller('audit') @UseGuards(SessionGuard,AdminGuard)
export class AuditController {
  constructor(private readonly db: PrismaService) {}
  @Get() async list(@Query() q: PageDto) {
    const [data,total] = await this.db.$transaction([
      this.db.auditEvent.findMany({skip:(q.page-1)*q.limit,take:q.limit,orderBy:[{createdAt:'desc'},{id:'desc'}],select:{id:true,entity:true,entityId:true,action:true,createdAt:true,changes:true,actor:{select:{id:true,name:true}}}}),
      this.db.auditEvent.count()
    ]);
    return {data,total,page:q.page,limit:q.limit};
  }
}
