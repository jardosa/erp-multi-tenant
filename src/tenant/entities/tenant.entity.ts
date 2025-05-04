import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql';
import { ERPModule } from 'src/common/constants/modules';
import TimestampEntity from 'src/common/entities/timestamp.entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

registerEnumType(ERPModule, {
  name: 'ERPModule',
  description: 'ERP Module',
});

@ObjectType()
@Entity('tenants')
export class Tenant extends TimestampEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ unique: true })
  slug: string;

  @Field()
  @Column()
  dbName: string;

  @Field()
  @Column({ default: 'free' })
  plan: 'free' | 'paid';

  @Field(() => [ERPModule])
  @Column({ type: 'text', array: true, default: [ERPModule.CRM] })
  enabledModules: ERPModule[];
}
