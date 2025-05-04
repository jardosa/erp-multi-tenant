import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { TenantModule } from 'src/tenant/tenant.module';
import { LeadService } from './lead.service';
import { LeadResolver } from './lead.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from './entities/lead.entity';

@Module({
  providers: [LeadService, LeadResolver],
  imports: [CommonModule, TenantModule, TypeOrmModule.forFeature([Lead])],
})
export class CrmModule {}
