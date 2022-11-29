import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class InsertChatroomDto {
  @IsString()
  @IsNotEmpty()
  msg: string;

  @IsNumber()
  @IsNotEmpty()
  senderId: number;
}
