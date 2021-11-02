import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ReportUseCase } from '../../domain/use-cases/report.use-case';
import { BookingUseCase } from '../../domain/use-cases/booking.use-case';
import { BookingDto } from './booking.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly _bookingUseCase: BookingUseCase, private readonly _reportUseCase: ReportUseCase) {}

  @Post()
  async booking(@Body() bookingDto: BookingDto, @Res() res: Response) {

    const from = new Date(bookingDto.from);
    const to = new Date(bookingDto.to);

    if (Number.isNaN(from.getDate()) || Number.isNaN(to.getDate())) {
      res.statusCode = 400;
      return res.json({ ok: false, message: 'The date is not correct' });
    }

    if (to.getTime() - from.getTime() < 0) {
      res.statusCode = 400;
      return res.json({ ok: false, message: 'The date "to" cannot be less than "from"' });
    }

    const result = await this._bookingUseCase.booking(bookingDto.carId, from, to);
    return res.json(result);
  }

  @Get('report')
  async report(@Query('year') year: string, @Query('month') month: string, @Res() res: Response): Promise<any> {
    const yearNumber = Number(year);
    const monthNumber = Number(month);

    if (Number.isNaN(yearNumber) || year.length < 4) {
      res.statusCode = 400;
      return res.json({ ok: false, message: 'The year param should be full year number' });
    }

    if (Number.isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
      res.statusCode = 400;
      return res.json({ ok: false, message: 'The month param should be digit from 1 to 12' });
    }

    const from = new Date(yearNumber, monthNumber - 1, 1);
    const daysInMonth = new Date(yearNumber, monthNumber, 0).getDate();
    const to = new Date(yearNumber, monthNumber - 1, daysInMonth);

    if (Number.isNaN(from.getDate()) || Number.isNaN(to.getDate())) {
      res.statusCode = 400;
      return res.json({ ok: false, message: 'The date is not correct' });
    }

    const result = await this._reportUseCase.report(from, to);
    return res.json({ ok: true, ...result });
  }
}
