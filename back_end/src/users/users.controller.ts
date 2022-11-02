import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  signUp(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('nickname') nickname: string,
    @Body('phone') phone: string,
    @Body('email') email: string,
    @Body('point') point: number,
    @Body('is_admin') is_admin: boolean,
  ): any {
    return this.usersService.signUp(
      username,
      password_hash,
      nickname,
      phone,
      email,
      point,
      is_admin,
    );
  }
}
