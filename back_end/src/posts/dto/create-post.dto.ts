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

  tags: Array<string>;

  @IsNumber()
  @IsNotEmpty()
  startPrice: number;

  @IsString()
  location: string;

  @IsString()
  qualityPlan: string;

  @IsString()
  promotion: string;
}
