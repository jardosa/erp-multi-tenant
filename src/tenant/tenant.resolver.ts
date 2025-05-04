import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TenantService } from './services/tenant.service';
import { Tenant } from './entities/tenant.entity';
import { CreateTenantInput } from './dto/create-tenant.input';
import { UpdateTenantInput } from './dto/update-tenant.input';

@Resolver(() => Tenant)
export class TenantResolver {
  constructor(private readonly tenantService: TenantService) {}

  @Mutation(() => Tenant, { name: 'registerTenant' })
  createTenant(
    @Args('createTenantInput') createTenantInput: CreateTenantInput,
  ) {
    return this.tenantService.createTenant({
      name: createTenantInput.name,
      slug: createTenantInput.slug.toLowerCase(),
    });
  }

  @Query(() => [Tenant], { name: 'tenants' })
  findAll() {
    return this.tenantService.findAll();
  }

  @Query(() => Tenant, { name: 'tenant' })
  findOne(@Args('slug') slug: string) {
    return this.tenantService.findBySlug(slug);
  }

  @Mutation(() => Tenant)
  updateTenant(
    @Args('updateTenantInput') updateTenantInput: UpdateTenantInput,
  ) {
    return this.tenantService.update(updateTenantInput.id, updateTenantInput);
  }

  @Mutation(() => Tenant)
  removeTenant(@Args('id', { type: () => Int }) id: number) {
    return this.tenantService.remove(id);
  }
}
