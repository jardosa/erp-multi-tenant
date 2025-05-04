// auth.resolver.ts
import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from 'src/user/entities/user.entity';
import { RegisterInput } from './dto/register.input';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => String)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const { access_token } = await this.authService
      .validateUser(email, password)
      .then((user) => this.authService.login(user));
    return access_token;
  }

  @Mutation(() => User)
  async register(@Args('input') input: RegisterInput) {
    return this.authService.register(input);
  }

  @Query(() => User)
  async me(@Context() context) {
    return context.req.user;
  }
}
