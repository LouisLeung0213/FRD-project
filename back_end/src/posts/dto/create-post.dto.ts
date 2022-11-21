import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class CreatePostDto {
  // @IsNumber()
  // @IsNotEmpty()
  // user_id: number;

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

  @IsBoolean()
  qualityPlan: boolean;

  @IsBoolean()
  promotion: boolean;
}
