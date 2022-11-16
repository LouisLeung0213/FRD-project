import { IsNumber, IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class CreatePostDto {
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @IsString()
  @IsNotEmpty()
  post_title: string;

  @IsString()
  @IsNotEmpty()
  post_description: string;

  @IsNumber()
  @IsNotEmpty()
  original_price: number;

  @IsNumber()
  min_price: number;

  @IsBoolean()
  @IsNotEmpty()
  q_mark: boolean;
}