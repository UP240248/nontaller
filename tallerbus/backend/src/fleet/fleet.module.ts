import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { FleetController, FleetGuard } from './fleet.controller';
import { FleetService } from './fleet.service';
@Module({imports:[AuthModule],controllers:[FleetController],providers:[FleetService,FleetGuard]})
export class FleetModule {}
