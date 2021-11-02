import { Logger, Module } from '@nestjs/common';
import { BookingUseCase } from '../../domain/use-cases/booking.use-case';
import { ReportUseCase } from '../../domain/use-cases/report.use-case';
import { RepositoryModule } from '../repository/repository.module';
import { BookingController } from './booking.controller';
@Module({
  imports: [RepositoryModule],
  controllers: [BookingController,],
  providers: [BookingUseCase, ReportUseCase, { provide: 'LOGGER', useClass: Logger }],
})
export class BookingModule {}
