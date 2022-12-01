import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBidDto {
  @IsNumber()
  @IsNotEmpty()
  postId: number;

  @IsNumber()
  @IsNotEmpty()
  buyerId: number;

  @IsNumber()
  @IsNotEmpty()
  bidPrice: number;

  @IsNumber()
  @IsNotEmpty()
  sellerId: number;

  @IsString()
  @IsNotEmpty()
  buyerNickname: string;

  @IsString()
  @IsNotEmpty()
  postTitle: string;
}
