import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from './prisma.service';
@ApiTags('Salud') @Controller('health')
export class HealthController {
  constructor(private readonly db: PrismaService) {}
  @Get() async health() { await this.db.$queryRaw`SELECT 1`; return {status:'ok',database:'connected'}; }
}
