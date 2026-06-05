import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards';
import { CreateFavoriteDto } from './dto/favorite.dto';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll(@Req() req: { user: { userId: number } }) {
    return this.favoritesService.findAll(req.user.userId);
  }

  @Post()
  create(@Req() req: { user: { userId: number } }, @Body() dto: CreateFavoriteDto) {
    return this.favoritesService.create(req.user.userId, dto);
  }

  @Delete(':id')
  remove(@Req() req: { user: { userId: number } }, @Param('id', ParseIntPipe) id: number) {
    return this.favoritesService.remove(req.user.userId, id);
  }

  @Delete('target/remove')
  removeByTarget(
    @Req() req: { user: { userId: number } },
    @Query('targetType') targetType: string,
    @Query('targetId') targetId: string,
  ) {
    return this.favoritesService.removeByTarget(
      req.user.userId,
      targetType,
      parseInt(targetId, 10),
    );
  }
}
