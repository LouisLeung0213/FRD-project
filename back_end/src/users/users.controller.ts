import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto, UpdateUserInfoDto } from './dto/update-user.dto';
import { get } from 'http';
// import { get } from 'http';

@Controller('users')
@UsePipes(ValidationPipe)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signUp')
  create(@Body() createUserDto: CreateUserDto) {
    try {
      return this.usersService.create(createUserDto);
    } catch (error) {
      return error;
    }
  }

  @Get('findOne/:id')
  findOne(@Param('id') id: number) {
    let userInfo = this.usersService.findOneById(id)
    return userInfo;
    // return this.usersService.findOne(username);
  }

  @Post('checkSignUp')
  checkSignUp(@Body() createUserDto: CreateUserDto) {
    return this.usersService.checkSignUp(createUserDto);
  }

  @Patch('updateUserInfo/:id')
  @UsePipes(ValidationPipe)
  updateUserInfo(
    @Param('id') id: number,
    @Body() updateUserInfoDto: UpdateUserInfoDto,
  ) {
    try {
      return this.usersService.updateUserInfo(+id, updateUserInfoDto);
    } catch (error) {
       return error;
    }
  }

  @Patch('updatePassword/:id')
  updatePassword(
    @Param('id') id: number,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    try {
      return this.usersService.updatePassword(+id, updatePasswordDto);
    } catch (error) {
      return error;
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Get('getAllUsers')
  findAll() {
    return this.usersService.findAll();
  }
}
