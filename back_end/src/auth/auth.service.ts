import { HttpException, Injectable, PayloadTooLargeException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
      ) {}
    
      async validateUser(username: string, pass: string): Promise<any> {
        try {
          const user = await this.usersService.findOne(username);
          if (user){
            if (await bcrypt.compare(pass, user.password)) {
              const { password, ...result } = user;
              return result;
            } else {
              throw new HttpException('Wrong username or password',401);
            }

          } 
        } catch (error) {
          return error;
        }
      }
    
      async login(user: any) {
        try {
          const payload = { username: user.username, sub: user.id };
          if (payload.username){
            return {
              access_token: this.jwtService.sign(payload),
            };
          } else {
            throw new HttpException('Wrong username or password',401);
          }
        } catch (error) {
          return error
        }
      }

      async getUserInfo(username: string){
        return await this.usersService.findOne(username);
      }
}
