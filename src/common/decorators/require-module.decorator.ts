// src/common/decorators/require-module.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { ERPModule } from '../constants/modules';

export const MODULE_REQUIRED_KEY = 'required_module';
export const RequireModule = (module: ERPModule) =>
  SetMetadata(MODULE_REQUIRED_KEY, module);
