import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateAdminDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
