import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePointsDto } from './dto/update-points.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('paymentIntent')
  paymentIntent(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.paymentIntent(createPaymentDto);
  }

  // @Patch('capturePaymentIntent')
  // async capturePaymentIntent(@Body() updatePointsDto: UpdatePointsDto) {
  //   return await this.paymentService.capturePaymentIntent(updatePointsDto);
  // }

  @Get('stripeConfig')
  stripeConfig() {
    return this.paymentService.stripeConfig();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Patch('addPoints')
  addPoints(@Body() updatePointsDto: UpdatePointsDto) {
    console.log('hi');
    console.log(updatePointsDto);
    return this.paymentService.addPoints(updatePointsDto);
  }

  @Patch('deductPoints')
  deductPoints(@Body() updatePointsDto: UpdatePointsDto) {
    console.log('bye');
    console.log(updatePointsDto);
    return this.paymentService.deductPoints(updatePointsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
