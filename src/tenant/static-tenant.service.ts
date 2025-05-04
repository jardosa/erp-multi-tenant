import { DataSource } from 'typeorm';
import { Tenant } from './entities/tenant.entity';

export function createStaticTenantService() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.GLOBAL_DB_HOST,
    port: 5432,
    username: process.env.GLOBAL_DB_USER,
    password: process.env.GLOBAL_DB_PASSWORD,
    database: process.env.GLOBAL_DB_NAME,
    entities: [Tenant],
    synchronize: false,
  });

  return {
    async getEnabledModules(slug: string) {
      await dataSource.initialize();
      const repo = dataSource.getRepository(Tenant);
      const tenant = await repo.findOne({ where: { slug } });
      return tenant?.enabledModules || [];
    },
  };
}
