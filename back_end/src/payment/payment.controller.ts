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
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('paymentIntent')
  paymentIntent(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.paymentIntent(createPaymentDto);
  }

  @Post('create-checkout-session')
  async sessionTest(@Body() createPaymentDto: CreatePaymentDto, @Res() res) {
    let url = await this.paymentService.sessionTest(createPaymentDto);

    return res.status(303).redirect(url);
  }

  @Get('stripeConfig')
  stripeConfig() {
    return this.paymentService.stripeConfig();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
