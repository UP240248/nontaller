import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionGuard, AdminGuard } from '../guards';
@Module({controllers:[AuthController],providers:[AuthService,SessionGuard,AdminGuard],exports:[SessionGuard,AdminGuard]})
export class AuthModule {}
