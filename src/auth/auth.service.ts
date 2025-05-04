// auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { RegisterInput } from './dto/register.input';
import { TenantConnectionService } from 'src/tenant/services/tenant-connection.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private tenantConnectionService: TenantConnectionService,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async validateUser(email: string, password: string) {
    const conn = await this.tenantConnectionService.getConnection();
    const userRepo = conn.getRepository(User);

    const user = await userRepo?.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user?.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(input: RegisterInput) {
    const conn = await this.tenantConnectionService.getConnection();
    const userRepo = conn.getRepository(User);

    const hash = await bcrypt.hash(input.password, 10);
    const user = userRepo.create({
      email: input.email,
      password: hash,
      name: input.name,
    });
    return this.userRepo.save(user);
  }
}
