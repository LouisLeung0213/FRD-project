import { IsNotEmpty, IsNumber } from 'class-validator';

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
}
