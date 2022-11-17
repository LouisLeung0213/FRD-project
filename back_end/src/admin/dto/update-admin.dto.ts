import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';
import { CreateAdminDto } from './create-admin.dto';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
