import { Controller, Get, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get('methods')
  getMethods() { return this.paymentsService.getMethods(); }

  @Get()
  getPayments() { return this.paymentsService.getPayments(); }

  @Post('create')
  create(@Body() body: any) { return this.paymentsService.createPayment(body); }
}
