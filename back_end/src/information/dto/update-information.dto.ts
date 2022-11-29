import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreateInformationDto } from './create-information.dto';

export class UpdateInformationDto extends PartialType(CreateInformationDto) {
  @IsNotEmpty()
  accountShouldDelete?: number;
}
