import { Module } from '@nestjs/common';
import { AdsModule } from './ads/ads.module';
import { AuthModule } from './auth/auth.module';
import { FavoritesModule } from './favorites/favorites.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProfilesModule } from './profiles/profiles.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, ProfilesModule, AdsModule, FavoritesModule],
})
export class AppModule {}
