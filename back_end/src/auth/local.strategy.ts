import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string)/* 個form都要跟番username同password呢個叫法，改左就唔得 */: Promise<any> {
    try {
      const user = await this.authService.validateUser(username, password);
      return user;
    } catch (error) {
      return error
        // throw new UnauthorizedException();
    }
  }
}