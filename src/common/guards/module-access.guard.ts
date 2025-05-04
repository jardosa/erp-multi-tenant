// src/common/guards/module-access.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { MODULE_REQUIRED_KEY } from '../decorators/require-module.decorator';
import { Reflector } from '@nestjs/core';
import { RequestContextService } from '../services/request-context.service';

@Injectable()
export class ModuleAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly requestContext: RequestContextService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredModule = this.reflector.get<string>(
      MODULE_REQUIRED_KEY,
      context.getHandler(),
    );
    if (!requiredModule) return true;

    const tenant = this.requestContext.get('tenant');
    if (!tenant) throw new ForbiddenException('Tenant context not found');

    const hasAccess = tenant.enabledModules?.includes(requiredModule);
    if (!hasAccess) {
      throw new ForbiddenException(
        `Module "${requiredModule}" not enabled for this tenant`,
      );
    }

    return true;
  }
}
