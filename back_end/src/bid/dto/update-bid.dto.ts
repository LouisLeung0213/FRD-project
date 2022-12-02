import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateBidDto } from './create-bid.dto';

export class UpdateBidDto extends PartialType(CreateBidDto) {
    @IsNumber()
    @IsNotEmpty()
    postId: number;

    @IsNumber()
    @IsNotEmpty()
    updatedPrice: number;
}
