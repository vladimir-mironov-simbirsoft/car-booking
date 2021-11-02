import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { DateEntity } from '../../domain/entities/date.entity';
import { IReportPort, ReportPort, ICarActivity } from '../../domain/ports/report.port';
import { getReport } from './report.query';

type ReportRows = {
  carId: number;
  licensePlate: string;
  percentagePerCar: string;
  totalPercentage: string;
};

@Injectable()
export class ReportRepository implements ReportPort {
  constructor(@Inject('DATABASE_POOL') private readonly _pool: Pool) {}

  async report(from: DateEntity, to: DateEntity): Promise<IReportPort> {
    const client = await this._pool.connect();
    try {
      const reportResult = await client.query(...getReport(from.format(), to.format()));
      const rows = reportResult.rows as ReportRows[];

      const result = rows.reduce(
        (obj, row) => {
          const carReport = {
            carId: row.carId,
            licensePlate: row.licensePlate,
            activityPercentage: parseFloat(row.percentagePerCar),
          };
          obj.cars.push(carReport);
          return obj;
        },
        { cars: [] as ICarActivity[], totalPercentage: 0 },
      );

      result.totalPercentage = parseFloat(rows[0].totalPercentage);
      return result;
    } finally {
      await client.release();
    }
  }
}
