import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AD_ICON_KEYS } from '../../common/ad-icons';

export class CreateAdDto {
  @IsString()
  @IsIn(['LOOKING_FOR_BAND', 'LOOKING_FOR_MUSICIAN'])
  type: string;

  @IsString()
  @IsIn([...AD_ICON_KEYS], { message: 'Выберите иконку' })
  icon: string;

  @IsString()
  @IsNotEmpty({ message: 'Город обязателен' })
  city: string;

  @IsString()
  @IsNotEmpty({ message: 'Жанр обязателен' })
  genre: string;

  @IsOptional()
  @IsString()
  instrument?: string;

  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  @IsString()
  lookingFor?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  @IsString()
  @IsIn(['active', 'draft', 'archive'])
  status?: string;
}

export class UpdateAdDto {
  @IsOptional()
  @IsString()
  @IsIn(['LOOKING_FOR_BAND', 'LOOKING_FOR_MUSICIAN'])
  type?: string;

  @IsOptional()
  @IsString()
  @IsIn([...AD_ICON_KEYS], { message: 'Некорректная иконка' })
  icon?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsString()
  instrument?: string;

  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  @IsString()
  lookingFor?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  @IsString()
  @IsIn(['active', 'draft', 'archive'])
  status?: string;
}
