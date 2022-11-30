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

  @IsNumber()
  @IsNotEmpty()
  photo_qty: number;

  @IsArray()
  @IsNotEmpty()
  photo: string[];

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

  @IsString()
  bankName: string;

  @IsNumber()
  bankAccount: number;

  @IsString()
  newBankName: string;

  @IsNumber()
  newBankAccount: number;

  @IsString()
  qualityPlan: string;

  @IsString()
  promotion: string;
}
