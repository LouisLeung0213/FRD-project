import { Injectable } from '@nestjs/common';
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
          if (await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
          }         
        } catch (error) {
          return error;
        }
      }
    
      async login(user: any) {
        const payload = { username: user.username, id: user.id };
        return {
          access_token: this.jwtService.sign(payload),
        };
      }
}
