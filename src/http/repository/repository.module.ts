import { Module } from '@nestjs/common';
import { BOOKING_PORT } from '../../domain/ports/booking.port';
import { REPORT_PORT } from '../../domain/ports/report.port';
import { DatabaseModule } from '../database/database.module';
import { BookingRepository } from './booking.repository';
import { ReportRepository } from './report.repository';
@Module({
  imports: [DatabaseModule],
  providers: [
    { provide: BOOKING_PORT, useClass: BookingRepository },
    { provide: REPORT_PORT, useClass: ReportRepository },
    BookingRepository,
    ReportRepository,
  ],
  exports: [BOOKING_PORT, REPORT_PORT],
})
export class RepositoryModule {}
