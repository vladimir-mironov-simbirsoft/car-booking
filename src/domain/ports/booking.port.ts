import { BookingEntity } from '../entities/booking.entity';
import { AnswerType } from '../types/answer.type';

export const BOOKING_PORT = Symbol('BOOKING_PORT');
type Days = number;

export interface BookingPort {
  booking(booking: BookingEntity, { extendStart, extendEnd }: { extendStart: Days; extendEnd: Days }): Promise<AnswerType>;
}
