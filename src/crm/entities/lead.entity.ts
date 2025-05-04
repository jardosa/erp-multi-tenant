import { ObjectType, Field, ID } from '@nestjs/graphql';
import Node from 'src/common/entities/node.entity';
import TimestampEntity from 'src/common/entities/timestamp.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { z } from 'zod';

export const leadSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().optional().nullable(),
  email: z.string().email().min(5),
  phone: z.string().min(10).nullable().optional(),
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  postalCode: z.string().nullable().optional(),
});

export type LeadType = z.infer<typeof leadSchema>;

@ObjectType({ implements: [Node] })
@Entity('leads')
export class Lead extends TimestampEntity implements Node, LeadType {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  firstName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  lastName?: string;

  @Field(() => ID)
  @Column()
  tenantId: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field({ nullable: true })
  @Column({ unique: true, nullable: true })
  phone?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  state?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  postalCode?: string;
}
