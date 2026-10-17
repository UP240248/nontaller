import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { IncidentGuard, IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';
import { EvidenceService } from './evidence.service';
@Module({imports:[AuthModule],controllers:[IncidentsController],providers:[IncidentsService,EvidenceService,IncidentGuard]})
export class IncidentsModule {}
