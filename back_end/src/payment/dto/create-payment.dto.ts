import { IsNumber, isNumber } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  amount: number;
}
