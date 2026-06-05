import { IsIn, IsInt } from 'class-validator';

export class CreateFavoriteDto {
  @IsIn(['musician', 'ad'])
  targetType: string;

  @IsInt()
  targetId: number;
}
