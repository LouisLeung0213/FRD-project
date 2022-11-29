import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InformationService } from './information.service';
import { CreateInformationDto } from './dto/create-information.dto';
import { UpdateInformationDto } from './dto/update-information.dto';

@Controller('information')
export class InformationController {
  constructor(private readonly informationService: InformationService) {}

  @Post()
  create(@Body() createInformationDto: CreateInformationDto) {
    return this.informationService.create(createInformationDto);
  }

  @Get('banks')
  allBank() {
    return this.informationService.allBank();
  }

  @Get('savedBank/:id')
  savedBank(@Param('id') id: string) {
    console.log(id);
    return this.informationService.savedBank(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInformationDto: UpdateInformationDto,
  ) {
    return this.informationService.update(+id, updateInformationDto);
  }

  @Delete('deleteBank')
  deleteBank(@Body() updateInformationDto: UpdateInformationDto) {
    return this.informationService.deleteBank(
      updateInformationDto.accountShouldDelete,
    );
  }
}
