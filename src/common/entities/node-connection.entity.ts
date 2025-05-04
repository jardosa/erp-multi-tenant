import { Field, Int, InterfaceType } from '@nestjs/graphql';
import Node from './node.entity';

@InterfaceType()
export default abstract class NodeConnection<T extends Node> {
  abstract nodes: T[];

  @Field(() => Int)
  totalCount: number;
}
