// src/tenant/tenant-connection.service.ts
import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Lead } from 'src/crm/entities/lead.entity';
import { User } from 'src/user/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TenantContextService } from './tenant-context.service';

@Injectable({ scope: Scope.REQUEST })
export class TenantConnectionService {
  private tenantId: string;

  constructor(
    private configService: ConfigService,
    private tenantContextService: TenantContextService,
  ) {
    this.tenantId = this.tenantContextService.getTenantId();
  }
  private connections: Map<string, DataSource> = new Map();

  async getConnection(): Promise<DataSource> {
    if (this.connections.has(this.tenantId)) {
      const existing = this.connections.get(this.tenantId);
      if (existing && existing.isInitialized) {
        return existing;
      }
    }

    const dataSourceOptions: DataSourceOptions = {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: `tenant_${this.tenantId}`,
      entities: [User, Lead],
      synchronize: this.configService.get<boolean>('DB_SYNC'),
    };

    const dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();

    this.connections.set(this.tenantId, dataSource);

    return dataSource;
  }
}
