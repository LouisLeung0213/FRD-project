import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateStatusDto {
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  adminComment: string;
  @IsNotEmpty()
  product_id;
}
