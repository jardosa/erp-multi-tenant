import { SetMetadata } from '@nestjs/common';

export const ModuleAccess = (module: string) => SetMetadata('module', module);
