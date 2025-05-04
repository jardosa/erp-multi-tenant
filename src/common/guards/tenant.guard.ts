// src/common/guards/tenant.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { TenantService } from 'src/tenant/services/tenant.service';
import { RequestContextService } from '../services/request-context.service';
import { REQUEST } from '@nestjs/core';
import { GqlContext } from 'src/graphql-context';

@Injectable()
export default class TenantGuard implements CanActivate {
  constructor(
    @Inject(REQUEST) private request: Request,
    private readonly tenantService: TenantService,
    private readonly requestContext: RequestContextService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext<GqlContext>().req;

    const slug = req['tenantId'];
    if (!slug) throw new UnauthorizedException('Tenant header missing');

    const tenant = await this.tenantService.findBySlug(slug);
    if (!tenant) throw new UnauthorizedException('Invalid tenant');

    this.requestContext.set('tenant', tenant); // store tenant context for this request
    return true;
  }
}
