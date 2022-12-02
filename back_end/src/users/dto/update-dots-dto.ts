import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

type Location = 'chat_dots' | 'notice_dots';

export class UpdateDotsDto {
  @IsString()
  @IsNotEmpty()
  statusLocation: Location;

  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}
