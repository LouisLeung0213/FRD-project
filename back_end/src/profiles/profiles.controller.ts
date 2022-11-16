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
  profile(@Param() userId: any) {
    // console.log("id: ", id);
    let user_id = userId.profile;
    return this.profileService.getUserInfo(user_id);
  }
}
