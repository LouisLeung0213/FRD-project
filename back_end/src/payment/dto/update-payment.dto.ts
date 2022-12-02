import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreatePaymentDto } from './create-payment.dto';

export class UpdatePointsDto extends PartialType(CreatePaymentDto) {
  @IsNumber()
  @IsNotEmpty()
  points: string;

  @IsNumber()
  userId: number;

  @IsString()
  @IsNotEmpty()
  clientSecret?;

  @IsNumber()
  bidPrice?: number;

  post_id?: number;
}
