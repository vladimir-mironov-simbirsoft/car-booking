import { Inject, Injectable } from '@nestjs/common';
import { BookingEntity, BookingPeriod, CarId } from '../entities/booking.entity';
import { DateEntity } from '../entities/date.entity';
import { Exception } from '../exceptions';
import { ILogger } from '../types/logger.interface';
import { BookingPort, BOOKING_PORT } from '../ports/booking.port';

type Cost = number;

@Injectable()
export class BookingUseCase {
  private readonly costRateMap: { [day: number]: Cost } = { 1: 1000, 5: 950, 10: 900, 18: 850 };

  constructor(
    @Inject('LOGGER') private readonly _logger: ILogger,
    @Inject(BOOKING_PORT) private readonly _bookingPort: BookingPort,
  ) {
    _logger.setContext('BookingUseCase');
  }

  private _calculateCost(daysNumber): number {
    let newCost = 0;
    let rateCost = 0;
    for (let day = 1; day <= daysNumber; day++) {
      if (this.costRateMap[day] >= 0) {
        rateCost = this.costRateMap[day];
      }

      newCost += rateCost;
    }

    return newCost;
  }

  async booking(
    carId: CarId,
    from: Date,
    to: Date,
  ): Promise<{ ok: true; cost: number } | { ok: false; message: string }> {
    try {
      const bookingPeriod: BookingPeriod = [new DateEntity(from), new DateEntity(to)];

      if (bookingPeriod[0].isWeekend()) {
        throw new Exception('Car cannot be booked since the period starts at weekend');
      }

      if (bookingPeriod[1].isWeekend()) {
        throw new Exception('Car cannot be booked since the period ends at weekend');
      }

      const bookingDaysNumber = DateEntity.getDatesRangeInDays(bookingPeriod[0], bookingPeriod[1]);

      if (bookingDaysNumber > 30) {
        throw new Exception('Car cannot be booked since the booking range is more than 30 days');
      }

      const cost = this._calculateCost(bookingDaysNumber);
      const bookingEntity = new BookingEntity(bookingPeriod, carId, cost);

      const result = await this._bookingPort.booking(bookingEntity, { extendStart: 3, extendEnd: 3 });

      if (result.ok !== true) {
        throw new Exception(result.message);
      }

      return { ok: true, cost };
    } catch (error) {
      if (error instanceof Exception) {
        this._logger.warn({ message: error.message, carId, from, to });
        return { ok: false, message: error.message };
      }

      throw error;
    }
  }
}
