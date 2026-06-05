import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { profileSearchFields } from '../common/search.util';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private sanitizeUser(user: {
    id: number;
    email: string;
    name: string;
    age: number | null;
    role: string;
    profile?: unknown;
  }) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      age: user.age,
      role: user.role,
      profile: user.profile ?? null,
    };
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new UnauthorizedException('Email уже зарегистрирован');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashed,
        age: dto.age,
        role: 'musician',
        profile: {
          create: {
            city: dto.city,
            instrument: dto.instrument,
            genres: dto.genres ?? '',
            experience: dto.experience,
            photo: dto.photo,
            demoUrl: dto.demoUrl,
            description: dto.description,
            contact: dto.contact,
            ...profileSearchFields({
              city: dto.city,
              instrument: dto.instrument,
              genres: dto.genres ?? '',
            }),
          },
        },
      },
      include: { profile: true },
    });

    const token = this.jwtService.sign({ sub: user.id, role: user.role });
    return { token, user: this.sanitizeUser(user) };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { profile: true },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const token = this.jwtService.sign({ sub: user.id, role: user.role });
    return { token, user: this.sanitizeUser(user) };
  }

  async getMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
    if (!user) throw new UnauthorizedException('Пользователь не найден');
    return this.sanitizeUser(user);
  }
}
