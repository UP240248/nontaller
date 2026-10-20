import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MaintenanceController, MaintenanceGuard, MaintenanceWriter, MaintenanceMechanic } from './maintenance.controller';
import { MaintenanceService } from './maintenance.service';
@Module({imports:[AuthModule],controllers:[MaintenanceController],providers:[MaintenanceService,MaintenanceGuard,MaintenanceWriter,MaintenanceMechanic]})
export class MaintenanceModule {}
