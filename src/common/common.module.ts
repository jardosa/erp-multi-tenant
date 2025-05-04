import { Module, Scope } from '@nestjs/common';
import { RequestContextService } from './services/request-context.service';
import { TenantModule } from 'src/tenant/tenant.module';

@Module({
  providers: [
    {
      provide: RequestContextService,
      useClass: RequestContextService,
      scope: Scope.REQUEST,
    },
  ],
  imports: [TenantModule],
  exports: [RequestContextService],
})
export class CommonModule {}
