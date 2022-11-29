import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateChatroomDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
