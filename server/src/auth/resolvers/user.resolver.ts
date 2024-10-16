import { Resolver, Query, Context } from '@nestjs/graphql';
import { NotFoundException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AuthService } from '../services/auth.service';
import { User } from '../entities/user.entity';

interface JwtPayload {
  userId: number;
  email: string;
  iat?: number;
  exp?: number;
}

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => User, { nullable: true })
  async verifyUser(@Context() context: any): Promise<User | null> {
    try {
      const request = context.req;
      console.log('Request object:', request);

      const authHeader = request.headers.authorization;
      const accessToken = authHeader?.split(' ')[1];

      if (!accessToken) {
        console.error('No access token found in request:', request);
        throw new NotFoundException('Access token is required.');
      }

      if (authHeader?.startsWith('Bearer ')) {
        console.log('Bearer token received successfully.');
      } else {
        console.warn('Authorization header does not start with Bearer.');
      }

      const payload = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      ) as JwtPayload;
      console.log('Decoded payload:', payload);

      const userId = payload.userId;
      const user: User | null = await this.authService.findById(userId);

      if (!user) {
        throw new NotFoundException('User not found.');
      }

      return user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw new NotFoundException('Unable to retrieve the current user.');
    }
  }
}
