import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, MinLength, MaxLength, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { SEX } from './sex.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Name should not be empty!' })
  @MinLength(2, { message: 'Name must contain at least 2 letters!' })
  @MaxLength(40, { message: 'Name must contain no more than 40 letters!' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Surname should not be empty!' })
  @MinLength(2, { message: 'Surname must contain at least 2 letters!' })
  @MaxLength(40, { message: 'Surname must contain no more than 40 letters!' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  surname?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Weight must be a number!' })
  @IsNotEmpty({ message: 'Weight should not be empty!' })
  @Transform(({ value }) => parseFloat(value))
  weight?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Height must be a number!' })
  @IsNotEmpty({ message: 'Height should not be empty!' })
  @Transform(({ value }) => parseFloat(value))
  height?: number;

  @IsOptional()
  @IsEnum(SEX, { message: 'Sex must be either MALE or FEMALE' })
  @IsNotEmpty({ message: 'Sex should not be empty!' })
  sex?: SEX;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Address should not be empty!' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  address?: string;

  @IsOptional()
  @IsString()
  imagePath?: string;
}
