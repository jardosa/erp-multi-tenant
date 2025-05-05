// user.entity.ts
import { ObjectType, Field, ID } from '@nestjs/graphql';
import Node from 'src/common/entities/node.entity';
import TimestampEntity from 'src/common/entities/timestamp.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType({ implements: [Node] })
@Entity()
export class User extends TimestampEntity implements Node {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Field()
  @Column()
  name: string;
}
