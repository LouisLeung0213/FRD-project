import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsString } from 'class-validator';
import { CreateStorageDto } from './create-storage.dto';

export class UpdateStorageDto extends PartialType(CreateStorageDto) {
  @IsNumber()
  @IsNotEmpty()
  sellerId: number;

  @IsString()
  @IsNotEmpty()
  receiptCode: string;
}
