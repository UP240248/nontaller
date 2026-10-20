import 'reflect-metadata';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Module, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { HealthController } from './health.controller';
import { DatabaseModule } from './database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuditModule } from './audit/audit.module';
import { FleetModule } from './fleet/fleet.module';
import { IncidentsModule } from './incidents/incidents.module';
import { WorkOrdersModule } from './work-orders/work-orders.module';
import { InventoryModule } from './inventory/inventory.module';
import { settings } from './config';
@Catch()
class Errors implements ExceptionFilter {
  catch(error: unknown, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse<Response>();
    let status = 500; let message: string | string[] = 'Error interno del servidor';
    if (error instanceof HttpException) {
      status = error.getStatus(); const body = error.getResponse();
      message = typeof body === 'object' && body !== null && 'message' in body ? (body as {message:string|string[]}).message : error.message;
    } else if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {status=409;message='Ya existe un registro con ese identificador';}
    else if (error instanceof Prisma.PrismaClientKnownRequestError && ['P2034','P2025'].includes(error.code)) {status=409;message='Conflicto de actualización; vuelve a intentar';}
    res.status(status).json({statusCode:status,message,requestId:res.getHeader('X-Request-Id')});
  }
}
@Module({imports:[DatabaseModule,AuthModule,UsersModule,AuditModule,FleetModule,IncidentsModule,WorkOrdersModule,InventoryModule],controllers:[HealthController]})
export class AppModule {}
export async function createApp() {
  const config = settings();
  const app = await NestFactory.create(AppModule,{logger:['error','warn','log']});
  app.use(helmet()); app.use(cookieParser());
  app.use((req: Request,res: Response,next: NextFunction)=>{
    const requestId = randomUUID(); const start = Date.now();
    res.setHeader('X-Request-Id',requestId); res.setHeader('Cache-Control','no-store');
    res.on('finish',()=> console.log(JSON.stringify({requestId,method:req.method,status:res.statusCode,durationMs:Date.now()-start})));
    next();
  });
  app.enableCors({origin:config.origin,credentials:true,allowedHeaders:['Content-Type','X-CSRF-Token'],methods:['GET','POST','PATCH','OPTIONS']});
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({transform:true,whitelist:true,forbidNonWhitelisted:true,forbidUnknownValues:true}));
  app.useGlobalFilters(new Errors());
  const document = SwaggerModule.createDocument(app,new DocumentBuilder().setTitle('TallerBus API').setVersion('1.0').addCookieAuth('tallerbus_session').build());
  if (process.env.NODE_ENV !== 'production') SwaggerModule.setup('api/docs',app,document);
  app.enableShutdownHooks();
  return app;
}
