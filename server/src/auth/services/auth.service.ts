import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '../entities/user.entity';
import { RegisterInput } from '../dto/register.input';
import { LoginInput } from '../dto/login.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  private generateAccessToken(userId: number, email: string): string {
    return this.jwtService.sign(
      { userId, email },
      { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: '1h' }
    );
  }

  private generateRefreshToken(userId: number, email: string): string {
    return this.jwtService.sign(
      { userId, email },
      { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: '7d' }
    );
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async register(
    registerInput: RegisterInput
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const { email, firstName, lastName, password } = registerInput;
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
      },
    });

    const accessToken = this.generateAccessToken(user.id, user.email);
    const refreshToken = this.generateRefreshToken(user.id, user.email);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return { user, accessToken, refreshToken };
  }

  async login(
    loginInput: LoginInput
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const user = await this.validateUser(loginInput.email, loginInput.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.generateAccessToken(user.id, user.email);
    const refreshToken = this.generateRefreshToken(user.id, user.email);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return { user, accessToken, refreshToken };
  }
}
