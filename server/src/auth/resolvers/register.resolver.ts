import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from '../services/auth.service';
import { RegisterInput } from '../dto/register.input';
import { Response } from 'express';
import { User } from '../entities/user.entity';

@Resolver(() => User)
export class RegisterResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async register(
    @Args('registerInput') registerInput: RegisterInput,
    @Context() context: { res: Response }
  ): Promise<User> {
    const { user, accessToken, refreshToken } =
      await this.authService.register(registerInput);

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
