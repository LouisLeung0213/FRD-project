import { IsNumber, IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class CreatePostDto {
  // @IsNumber()
  // @IsNotEmpty()
  // user_id: number;

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

  @IsNumber()
  dealPrice: number;

  @IsBoolean()
  qualityPlan: boolean;

  @IsBoolean()
  promotion: boolean;
}
