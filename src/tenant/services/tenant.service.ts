import { Injectable } from '@nestjs/common';
import { CreateTenantInput } from '../dto/create-tenant.input';
import { UpdateTenantInput } from '../dto/update-tenant.input';
import { User } from 'src/user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant } from '../entities/tenant.entity';
import * as bcrypt from 'bcryptjs';
import { ERPModule } from 'src/common/constants/modules';
import { Lead } from 'src/crm/entities/lead.entity';

@Injectable()
export class TenantService {
  private connections = new Map<string, DataSource>();

  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
  ) {}

  async createTenant(input: CreateTenantInput): Promise<Tenant> {
    const dbName = `tenant_${input.slug}`;

    // 1. Save to shared metadata db
    const tenant = this.tenantRepo.create({
      slug: input.slug,
      dbName,
      name: input.name,
      plan: 'free',
      enabledModules: [ERPModule.CRM],
    });
    await this.tenantRepo.save(tenant);

    // 2. Create new Postgres DB (using core DB connection)
    const queryRunner = this.tenantRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.query(`CREATE DATABASE "${dbName}"`);
    await queryRunner.release();

    // 3. Initialize schema in new DB
    const newConn = new DataSource({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: dbName,
      entities: [User], // Add more as needed
      synchronize: true,
    });

    await newConn.initialize();
    this.connections.set(input.slug, newConn);

    await newConn.getRepository(User).save({
      email: 'admin@' + input.slug,
      password: await bcrypt.hash('admin123', 10),
      name: 'Admin User',
    });

    return tenant;
  }

  async getEnabledModules(slug: string) {
    const tenant = await this.tenantRepo.findOneByOrFail({ slug });
    return tenant.enabledModules;
  }

  findAll() {
    return `This action returns all tenant`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tenant`;
  }

  async findBySlug(slug: string) {
    const tenant = await this.tenantRepo.findOneByOrFail({ slug });
    return tenant;
  }

  update(id: number, updateTenantInput: UpdateTenantInput) {
    return `This action updates a #${id} tenant`;
  }

  remove(id: number) {
    return `This action removes a #${id} tenant`;
  }
}
