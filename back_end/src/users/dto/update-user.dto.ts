import { PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserInfoDto extends PartialType(CreateUserDto){
    @IsString()
    @IsNotEmpty()
    username: string;
  
    @IsString()
    @IsNotEmpty()
    nickname: string;
  
    @IsString()
    @IsNotEmpty()
    phone: string;
  
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;
  
}

export class UpdatePasswordDto {
    @IsString()
    @IsNotEmpty()
    newPassword: string;
  
}
