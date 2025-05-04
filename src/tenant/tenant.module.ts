import { Module, Scope } from '@nestjs/common';
import { TenantService } from './services/tenant.service';
import { TenantResolver } from './tenant.resolver';
import { Tenant } from './entities/tenant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantConnectionService } from './services/tenant-connection.service';
import { TenantContextService } from './services/tenant-context.service';

@Module({
  providers: [
    TenantResolver,
    TenantService,
    {
      provide: TenantConnectionService,
      useClass: TenantConnectionService,
      scope: Scope.REQUEST,
    },
    {
      provide: TenantContextService,
      useClass: TenantContextService,
      scope: Scope.REQUEST,
    },
  ],
  imports: [TypeOrmModule.forFeature([Tenant])],
  exports: [
    TenantService,
    TypeOrmModule,
    TenantConnectionService,
    TenantContextService,
  ],
})
export class TenantModule {}
