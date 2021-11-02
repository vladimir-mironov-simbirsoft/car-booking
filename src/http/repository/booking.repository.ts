import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { BookingEntity, CarId } from '../../domain/entities/booking.entity';
import { BookingPort } from '../../domain/ports/booking.port';
import { AnswerType } from '../../domain/types/answer.type';
import { getCarExclusive, getOuterPeriods, insertBooking } from './booking.query';
import { RepositoryException } from './exceptions';

@Injectable()
export class BookingRepository implements BookingPort {
  constructor(@Inject('DATABASE_POOL') private readonly _pool: Pool) {}

  async booking(booking: BookingEntity, { extendStart, extendEnd }: { extendStart: number; extendEnd: number }): Promise<AnswerType> {
    const client = await this._pool.connect();
    try {
      await client.query('BEGIN');
      const car = (await client.query(...getCarExclusive(booking.carId))).rows[0] as { id: CarId } | undefined;

      if (!car) {
        throw new RepositoryException(`Cannot find car with id ${booking.carId}`);
      }

      const extendedPeriod: [Date, Date] = [
        booking.bookingPeriod[0].subtractDays(extendStart ? extendStart - 1 : extendStart).date,
        booking.bookingPeriod[1].addDays(extendEnd ? extendEnd - 1 : extendEnd).date,
      ];

      const isPeriodFree =
        (await client.query(...getOuterPeriods(booking.carId, extendedPeriod[0], extendedPeriod[1]))).rows.length === 0;

      if (!isPeriodFree) {
        throw new RepositoryException(`Current period is not available`);
      }

      await client.query(
        ...insertBooking(booking.carId, booking.bookingPeriod[0].date, booking.bookingPeriod[1].date, booking.cost),
      );

      await client.query('COMMIT');
      return { ok: true };
    } catch (error) {
      await client.query('ROLLBACK');

      if (error instanceof RepositoryException) {
        return { ok: false, message: error.message };
      }

      throw error;
    } finally {
      await client.release();
    }
  }
}
