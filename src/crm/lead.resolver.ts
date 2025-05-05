import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { LeadService } from './lead.service';
import { Lead } from './entities/lead.entity';
import { CreateLeadInput } from './dto/create-lead.input';
import { UpdateLeadInput } from './dto/update-lead.input';
import { RequestContextService } from 'src/common/services/request-context.service';
import TenantGuard from 'src/common/guards/tenant.guard';
import { UseGuards } from '@nestjs/common';
import { ModuleAccessGuard } from 'src/common/guards/module-access.guard';
import { RequireModule } from 'src/common/decorators/require-module.decorator';
import { ERPModule } from 'src/common/constants/modules';
import { Tenant } from 'src/tenant/entities/tenant.entity';

@UseGuards(ModuleAccessGuard)
@UseGuards(TenantGuard)
@Resolver(() => Lead)
export class LeadResolver {
  constructor(
    private readonly leadService: LeadService,
    private readonly requestContext: RequestContextService,
  ) {}

  @RequireModule(ERPModule.CRM)
  @Mutation(() => Lead)
  createLead(@Args('createLeadInput') createLeadInput: CreateLeadInput) {
    const tenant = this.requestContext.get<Tenant>('tenant');
    return this.leadService.create(createLeadInput, tenant.slug);
  }

  @RequireModule(ERPModule.CRM)
  @Query(() => [Lead], { name: 'leads' })
  findAll() {
    return this.leadService.findAll({});
  }

  @RequireModule(ERPModule.CRM)
  @Query(() => Lead, { name: 'lead' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.leadService.findOne(id);
  }

  @RequireModule(ERPModule.CRM)
  @Mutation(() => Lead)
  async updateLead(@Args('updateLeadInput') updateLeadInput: UpdateLeadInput) {
    return this.leadService.update(updateLeadInput);
  }

  @RequireModule(ERPModule.CRM)
  @Mutation(() => ID)
  async removeLead(@Args('id', { type: () => String }) id: string) {
    return this.leadService.remove(id);
  }
}
