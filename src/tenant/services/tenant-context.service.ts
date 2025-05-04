import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { GqlContext } from 'src/graphql-context';

@Injectable({ scope: Scope.REQUEST })
export class TenantContextService {
  private tenantId: string;
  constructor(@Inject(REQUEST) private readonly context: GqlContext) {
    this.tenantId = context.req.tenantId;
  }

  setTenantId(tenantId: string) {
    this.tenantId = tenantId;
  }

  getTenantId(): string {
    return this.tenantId;
  }
}
