import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFavoriteDto } from './dto/favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const result = await Promise.all(
      favorites.map(async (fav) => {
        if (fav.targetType === 'musician') {
          const profile = await this.profilesSafe(fav.targetId);
          return profile ? { ...fav, data: profile } : null;
        }
        const ad = await this.prisma.ad.findUnique({
          where: { id: fav.targetId },
          include: { user: { select: { id: true, name: true } } },
        });
        return ad ? { ...fav, data: ad } : null;
      }),
    );

    return result.filter(Boolean);
  }

  private async profilesSafe(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
    if (!user?.profile) return null;
    const { id: profileId, userId, ...profileRest } = user.profile;
    return {
      id: user.id,
      profileId,
      name: user.name,
      age: user.age,
      ...profileRest,
    };
  }

  async create(userId: number, dto: CreateFavoriteDto) {
    if (dto.targetType === 'musician') {
      const profile = await this.profilesSafe(dto.targetId);
      if (!profile) throw new NotFoundException('Музыкант не найден');
    } else {
      const ad = await this.prisma.ad.findUnique({ where: { id: dto.targetId } });
      if (!ad) throw new NotFoundException('Объявление не найдено');
    }

    try {
      return await this.prisma.favorite.create({
        data: { userId, targetType: dto.targetType, targetId: dto.targetId },
      });
    } catch {
      throw new ConflictException('Уже в избранном');
    }
  }

  async remove(userId: number, id: number) {
    const fav = await this.prisma.favorite.findFirst({ where: { id, userId } });
    if (!fav) throw new NotFoundException('Запись не найдена');
    await this.prisma.favorite.delete({ where: { id } });
    return { message: 'Удалено из избранного' };
  }

  async removeByTarget(userId: number, targetType: string, targetId: number) {
    const fav = await this.prisma.favorite.findFirst({
      where: { userId, targetType, targetId },
    });
    if (!fav) throw new NotFoundException('Запись не найдена');
    await this.prisma.favorite.delete({ where: { id: fav.id } });
    return { message: 'Удалено из избранного' };
  }
}
