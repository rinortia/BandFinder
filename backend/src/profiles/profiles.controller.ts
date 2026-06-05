import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../common/guards';
import { PHOTOS_DIR, photoUploadOptions } from '../common/upload.config';
import { UpdateProfileDto } from './dto/profile.dto';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('city') city?: string,
    @Query('instrument') instrument?: string,
    @Query('genre') genre?: string,
    @Query('minAge') minAge?: string,
    @Query('maxAge') maxAge?: string,
    @Query('sort') sort?: string,
  ) {
    return this.profilesService.findAll({
      search,
      city,
      instrument,
      genre,
      minAge: minAge ? parseInt(minAge, 10) : undefined,
      maxAge: maxAge ? parseInt(maxAge, 10) : undefined,
      sort,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.profilesService.findOne(id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateMe(@Req() req: { user: { userId: number } }, @Body() dto: UpdateProfileDto) {
    return this.profilesService.update(req.user.userId, dto);
  }

  @Post('me/photo')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: PHOTOS_DIR,
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
          cb(null, unique);
        },
      }),
      ...photoUploadOptions,
    }),
  )
  uploadPhoto(
    @Req() req: { user: { userId: number } },
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Файл не выбран или формат не поддерживается');
    }
    const photo = `/uploads/photos/${file.filename}`;
    return this.profilesService.update(req.user.userId, { photo });
  }
}
