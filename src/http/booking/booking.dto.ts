import { IsDateString, IsNumber } from 'class-validator';

export class BookingDto {
  @IsNumber()
  carId: number;

  @IsDateString({ strict: true })
  from: string;

  @IsDateString({ strict: true })
  to: string;
}
