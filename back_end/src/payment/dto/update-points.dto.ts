import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreatePaymentDto } from './create-payment.dto';

export class UpdatePointsDto extends PartialType(CreatePaymentDto) {
  @IsNumber()
  @IsNotEmpty()
  points?: string;

  @IsNumber()
  userId?: number;

  @IsString()
  @IsNotEmpty()
  clientSecret?;

  @IsNumber()
  bidPrice?: string;

  post_id?: string;

  bidder_id?: string;
}
