import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  user_id: string;

  // photo: File[];

  // image: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  tags: string;

  @IsNumber()
  @IsNotEmpty()
  startPrice: number;

  @IsString()
  location: string;

  @IsNumber()
  bankAccount: number;

  @IsString()
  qualityPlan: string;

  @IsString()
  promotion: string;
}
