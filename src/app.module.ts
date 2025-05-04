import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

// import { TenantModule } from './tenant/tenant.module';
// import { AuthModule } from './auth/auth.module';
// import { OrganizationModule } from './organization/organization.module';
// import { UserModule } from './user/user.module';
// import { ModuleManagementModule } from './modules/module.module'; // system modules
import { TenantModule } from './tenant/tenant.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CrmModule } from './crm/crm.module';
import { CommonModule } from './common/common.module';

export const databaseConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    autoLoadEntities: true,
    synchronize: configService.get<boolean>('DB_SYNC'), // ❗ set false on production
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local'] }),
    TypeOrmModule.forRootAsync(databaseConfigAsync),
    TenantModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), './src/graphql/schema.gql'),
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      playground: false,
      context: ({ req }) => {
        return { req: { ...req, tenantId: req.headers['x-tenant-id'] } };
      },
      subscriptions: {
        'graphql-ws': true,
      },
    }),
    UserModule,
    AuthModule,
    CrmModule,
    CommonModule,
    // OrganizationModule,
    // UserModule,
    // ModuleManagementModule,
  ],
})
export class AppModule {}
