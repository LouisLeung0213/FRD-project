import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateStorageDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @IsNotEmpty()
  sellerId: number;

  @IsString()
  @IsNotEmpty()
  receiptCode: string;
}
