import { DateEntity } from './date.entity';

export type CarId = number;
export type BookingId = string;
export type BookingPeriod = [DateEntity, DateEntity];

export class BookingEntity {
  constructor(
    private readonly _bookingPeriod: BookingPeriod,
    private readonly _carId: CarId,
    private _cost: number,
    private readonly _id?: BookingId,
  ) {}

  public get id(): string {
    return this._id;
  }

  public get cost(): number | null {
    return this._cost;
  }

  public get carId(): CarId {
    return this._carId;
  }

  public get bookingPeriod(): [DateEntity, DateEntity] {
    return this._bookingPeriod;
  }
}
