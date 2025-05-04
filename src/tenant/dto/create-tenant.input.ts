import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateTenantInput {
  @Field()
  slug: string;

  @Field()
  name: string;
}
