import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeadInput } from './dto/create-lead.input';
import { UpdateLeadInput } from './dto/update-lead.input';
import { Lead } from './entities/lead.entity';
import { Repository } from 'typeorm';
import { TenantConnectionService } from 'src/tenant/services/tenant-connection.service';

@Injectable()
export class LeadService {
  constructor(private readonly tenantConnection: TenantConnectionService) {}

  async getRepo(): Promise<Repository<Lead>> {
    const conn = await this.tenantConnection.getConnection();
    return conn.getRepository(Lead);
  }

  async create(createLeadInput: CreateLeadInput, tenantId: string) {
    const repo = await this.getRepo();

    const lead = repo.create({ ...createLeadInput, tenantId });
    return repo.save(lead);
  }

  async findAll(query: any) {
    const leadRepo = await this.getRepo();

    const leads = await leadRepo.find(query);

    return leads;
  }

  async findOne(id: string) {
    const leadRepo = await this.getRepo();

    const lead = await leadRepo.findOneByOrFail({ id });

    return lead;
  }

  async update(updateLeadInput: UpdateLeadInput) {
    const repo = await this.getRepo();

    const lead = await repo.findOneBy({ id: updateLeadInput.id });

    if (!lead)
      throw new NotFoundException(
        `Lead with id ${updateLeadInput.id} not found`,
      );

    return repo.save({ ...lead, ...updateLeadInput });
  }

  async remove(id: string) {
    const repo = await this.getRepo();
    await repo.delete(id);
    return id;
  }
}
