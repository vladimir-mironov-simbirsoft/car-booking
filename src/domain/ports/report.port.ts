import { CarId } from '../entities/booking.entity';
import { DateEntity } from '../entities/date.entity';

export const REPORT_PORT = Symbol('REPORT_PORT');

export interface ICarActivity {
  carId: CarId;
  licensePlate: string;
  activityPercentage: number;
}

export interface IReportPort {
  cars: ICarActivity[];
  totalPercentage: number;
}

export interface ReportPort {
  report(from: DateEntity, to: DateEntity): Promise<IReportPort>;
}
