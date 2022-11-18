import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateStorageDto {
  @IsNumber()
  @IsNotEmpty()
  sellerId: number;

  @IsString()
  @IsNotEmpty()
  receiptCode: string;
}
