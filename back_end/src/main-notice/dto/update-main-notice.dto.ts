import { PartialType } from '@nestjs/swagger';
import { CreateMainNoticeDto } from './create-main-notice.dto';

export class UpdateMainNoticeDto extends PartialType(CreateMainNoticeDto) {}
