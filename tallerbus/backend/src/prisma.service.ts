import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { databaseAdapter } from './database';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {super({adapter:databaseAdapter()});}
  async onModuleInit() { await this.$connect(); await this.$queryRaw`SELECT 1`; }
  async onModuleDestroy() { await this.$disconnect(); }
}
