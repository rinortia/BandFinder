import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { adSearchFields, normalizeSearchText } from '../common/search.util';
import { CreateAdDto, UpdateAdDto } from './dto/ad.dto';

@Injectable()
export class AdsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    search?: string;
    type?: string;
    city?: string;
    genre?: string;
    userId?: number;
    status?: string;
    limit?: number;
  }) {
    return this.prisma.ad.findMany({
      where: {
        ...(query.userId && { userId: query.userId }),
        ...(query.type && { type: query.type }),
        ...(query.city && {
          citySearch: { contains: normalizeSearchText(query.city) },
        }),
        ...(query.genre && {
          genreSearch: { contains: normalizeSearchText(query.genre) },
        }),
        ...(query.status && { status: query.status }),
        ...(!query.userId && !query.status && { status: 'active' }),
        ...(query.search && {
          OR: [
            { about: { contains: query.search } },
            { description: { contains: query.search } },
            { lookingFor: { contains: query.search } },
            { instrument: { contains: query.search } },
            { city: { contains: query.search } },
          ],
        }),
      },
      include: {
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      ...(query.limit && { take: query.limit }),
    });
  }

  async findOne(id: number) {
    const ad = await this.prisma.ad.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true } } },
    });
    if (!ad) throw new NotFoundException('Объявление не найдено');
    return ad;
  }

  create(userId: number, dto: CreateAdDto) {
    return this.prisma.ad.create({
      data: {
        ...dto,
        userId,
        status: dto.status ?? 'active',
        ...adSearchFields({ city: dto.city, genre: dto.genre }),
      },
      include: { user: { select: { id: true, name: true } } },
    });
  }

  async update(id: number, userId: number, dto: UpdateAdDto) {
    const ad = await this.findOne(id);
    if (ad.userId !== userId) throw new ForbiddenException('Нет доступа');

    const city = dto.city ?? ad.city;
    const genre = dto.genre ?? ad.genre;

    return this.prisma.ad.update({
      where: { id },
      data: {
        ...dto,
        ...adSearchFields({ city, genre }),
      },
      include: { user: { select: { id: true, name: true } } },
    });
  }

  async remove(id: number, userId: number) {
    const ad = await this.findOne(id);
    if (ad.userId !== userId) throw new ForbiddenException('Нет доступа');
    await this.prisma.ad.delete({ where: { id } });
    return { message: 'Объявление удалено' };
  }
}
