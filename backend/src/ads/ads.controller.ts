import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards';
import { AdsService } from './ads.service';
import { CreateAdDto, UpdateAdDto } from './dto/ad.dto';

@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('type') type?: string,
    @Query('city') city?: string,
    @Query('genre') genre?: string,
    @Query('userId') userId?: string,
    @Query('status') status?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adsService.findAll({
      search,
      type,
      city,
      genre,
      userId: userId ? parseInt(userId, 10) : undefined,
      status,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.adsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: { user: { userId: number } }, @Body() dto: CreateAdDto) {
    return this.adsService.create(req.user.userId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: { userId: number } },
    @Body() dto: UpdateAdDto,
  ) {
    return this.adsService.update(id, req.user.userId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: { user: { userId: number } }) {
    return this.adsService.remove(id, req.user.userId);
  }
}
