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
import { ProfilesService } from './profiles.service';

@Controller('profiles')
@UsePipes(ValidationPipe)
export class ProfilesController {
  constructor(private readonly profileService: ProfilesService) {}

  @Get(':profile')
  profile(@Param() id: any) {
    // console.log(id.profile);
    let userId = id.profile;
    return this.profileService.getUserInfo(+userId);
  }
}
