import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreatePaymentDto } from './create-payment.dto';

export class UpdatePointsDto extends PartialType(CreatePaymentDto) {
  @IsNotEmpty()
  points: number;

  @IsNumber()
  userId: number;
}
