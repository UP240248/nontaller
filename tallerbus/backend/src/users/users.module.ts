import { OperatorFleetController, OperatorFleetService } from './operator-fleet';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
@Module({imports:[AuthModule],controllers:[UsersController,OperatorFleetController],providers:[UsersService,OperatorFleetService]})
export class UsersModule {}
