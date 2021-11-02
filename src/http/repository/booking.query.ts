import { CarId } from '../../domain/entities/booking.entity';

type Query = [string, any[]];

export const getCarExclusive = (carId: CarId): Query => [
  `
    SELECT car."id"
    FROM car
    WHERE car."id" = $1
    FOR UPDATE
  `,
  [carId],
];

export const getOuterPeriods = (carId: CarId, from: Date, to: Date): Query => [
  `
    SELECT booking."uuid"
    FROM booking
    WHERE booking."carId" = $1
    AND booking."from" <= $2 :: timestamp
    AND booking."to" >= $3 :: timestamp
  `,
  [carId, to, from],
];

export const insertBooking = (carId: CarId, from: Date, to: Date, cost: number): Query => [
  `
    INSERT INTO booking ("from", "to", "carId", "cost")
    VALUES ($1, $2, $3, $4)
  `,
  [from, to, carId, cost],
];
