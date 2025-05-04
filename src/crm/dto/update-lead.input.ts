import Node from 'src/common/entities/node.entity';
import { CreateLeadInput } from './create-lead.input';
import { Field, InputType, PartialType } from '@nestjs/graphql';

@InputType({ description: 'Input for updating a lead' })
export class UpdateLeadInput
  extends PartialType(CreateLeadInput)
  implements Node
{
  @Field()
  id: string;
}
