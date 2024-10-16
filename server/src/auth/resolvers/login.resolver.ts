import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from '../services/auth.service';
import { LoginInput } from '../dto/login.input';
import { Response } from 'express';
import { User } from '../entities/user.entity';

@Resolver(() => User)
export class LoginResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async login(
    @Args('loginInput') loginInput: LoginInput,
    @Context() context: { res: Response }
  ): Promise<User> {
    const { user, accessToken, refreshToken } =
      await this.authService.login(loginInput);

    context.res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true,
    });
    context.res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return user;
  }
}
