import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { normalizeSearchText, profileSearchFields } from '../common/search.util';
import { UpdateProfileDto } from './dto/profile.dto';

function parseExperienceYears(value: string): number {
  const match = value.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    search?: string;
    city?: string;
    instrument?: string;
    genre?: string;
    minAge?: number;
    maxAge?: number;
    sort?: string;
  }) {
    const profileFilter = {
      ...(query.city && {
        citySearch: { contains: normalizeSearchText(query.city) },
      }),
      ...(query.instrument && {
        instrumentSearch: { contains: normalizeSearchText(query.instrument) },
      }),
      ...(query.genre && {
        genresSearch: { contains: normalizeSearchText(query.genre) },
      }),
    };

    const users = await this.prisma.user.findMany({
      where: {
        profile:
          Object.keys(profileFilter).length > 0
            ? { is: profileFilter }
            : { isNot: null },
        ...(query.search && {
          OR: [
            { name: { contains: query.search } },
            { profile: { instrument: { contains: query.search } } },
            { profile: { city: { contains: query.search } } },
          ],
        }),
        ...((query.minAge != null || query.maxAge != null) && {
          age: {
            ...(query.minAge != null && { gte: query.minAge }),
            ...(query.maxAge != null && { lte: query.maxAge }),
          },
        }),
      },
      include: { profile: true },
      orderBy: { createdAt: 'desc' },
    });

    if (query.sort === 'experience') {
      users.sort(
        (a, b) =>
          parseExperienceYears(b.profile!.experience) -
          parseExperienceYears(a.profile!.experience),
      );
    }

    return users.map((u) => {
      const {
        id: profileId,
        userId,
        citySearch: _citySearch,
        instrumentSearch: _instrumentSearch,
        genresSearch: _genresSearch,
        ...profileRest
      } = u.profile!;
      return {
        id: u.id,
        profileId,
        name: u.name,
        age: u.age,
        createdAt: u.createdAt,
        ...profileRest,
      };
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
    if (!user?.profile) throw new NotFoundException('Профиль не найден');
    const {
      id: profileId,
      userId,
      citySearch: _citySearch,
      instrumentSearch: _instrumentSearch,
      genresSearch: _genresSearch,
      ...profileRest
    } = user.profile;
    return {
      id: user.id,
      profileId,
      name: user.name,
      age: user.age,
      createdAt: user.createdAt,
      ...profileRest,
    };
  }

  async update(userId: number, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
    if (!user?.profile) throw new NotFoundException('Профиль не найден');

    const { name, age, ...profileData } = dto;

    if (name || age !== undefined) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { ...(name && { name }), ...(age !== undefined && { age }) },
      });
    }

    const profile = await this.prisma.musicianProfile.update({
      where: { userId },
      data: {
        ...profileData,
        ...profileSearchFields(profileData),
      },
    });

    const updatedUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    return {
      id: updatedUser!.id,
      name: updatedUser!.name,
      age: updatedUser!.age,
      city: profile.city,
      instrument: profile.instrument,
      genres: profile.genres,
      experience: profile.experience,
      photo: profile.photo,
      demoUrl: profile.demoUrl,
      description: profile.description,
      contact: profile.contact,
    };
  }
}
