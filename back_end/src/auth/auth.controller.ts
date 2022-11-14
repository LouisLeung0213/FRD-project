import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    try {
      return this.authService.login(req.user);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Request() req) {
    return this.authService.getUserInfo(req.user.username);
  }
}
