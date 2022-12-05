import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Server } from 'socket.io';
import { io } from 'src/io';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  setupIO(io: Server) {}

  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Post(':id')
  async bannedUser(
    @Param('id') id: number,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    let banUser = await this.adminService.bannedUser(id, updateAdminDto);
    console.log(banUser);
    if ('user_id' in banUser) {
      io.to('TJroom: ' + banUser.user_id).emit('ban', {
        msg: 'You have been banned',
      });
    } else {
      return { message: 'unable to ban' };
    }
    return banUser;
  }

  @Get()
  findAll() {
    return this.adminService.findAll();
    // return { msg: 'Hello' };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return this.adminService.remove(+id, updateAdminDto);
  }
}
