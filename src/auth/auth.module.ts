import { UserModule } from './../user/user.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule, JwtModuleAsyncOptions } from '@nestjs/jwt';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { TenantModule } from 'src/tenant/tenant.module';

export const jwtConfigAsync: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET_KEY'),
    signOptions: {
      expiresIn: configService.get<string>('EXPIRATION_IN_DAYS') + 'd',
    },
  }),
  inject: [ConfigService],
};

@Module({
  providers: [AuthResolver, AuthService, JwtStrategy],
  imports: [TenantModule, UserModule, JwtModule.registerAsync(jwtConfigAsync)],
})
export class AuthModule {}
