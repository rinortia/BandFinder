import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'Имя обязательно' })
  name: string;

  @IsEmail({}, { message: 'Некорректный email' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
  password: string;

  @IsInt()
  @Min(14, { message: 'Минимальный возраст — 14 лет' })
  age: number;

  @IsString()
  @IsNotEmpty({ message: 'Город обязателен' })
  city: string;

  @IsString()
  @IsNotEmpty({ message: 'Инструмент обязателен' })
  instrument: string;

  @IsOptional()
  @IsString()
  genres?: string;

  @IsString()
  @IsNotEmpty({ message: 'Опыт обязателен' })
  experience: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsString()
  demoUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  contact?: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'Некорректный email' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Пароль обязателен' })
  password: string;
}
