import { Field, ID, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export default abstract class Node {
  @Field(() => ID)
  id: string;
}
