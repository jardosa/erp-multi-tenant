import { InputType, Field } from '@nestjs/graphql';
import { LeadType } from '../entities/lead.entity';

@InputType({ description: 'Input for creating a lead' })
export class CreateLeadInput implements LeadType {
  @Field()
  firstName: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  state?: string;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  postalCode?: string;
}
