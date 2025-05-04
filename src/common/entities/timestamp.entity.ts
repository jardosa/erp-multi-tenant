import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import * as dayjs from 'dayjs';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
@Entity()
class TimestampEntity {
  @Field(() => Int)
  @Column({
    type: 'bigint',
    default: () => `EXTRACT(EPOCH FROM NOW())::bigint`,
  })
  createdAt: number;

  @Field(() => Int)
  @Column({
    type: 'bigint',
    default: () => `EXTRACT(EPOCH FROM NOW())::bigint`,
  })
  updatedAt: number;

  @BeforeInsert()
  setCreatedAt() {
    this.createdAt = dayjs().unix();
  }

  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = dayjs().unix();
  }
}

export default TimestampEntity;
