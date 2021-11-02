import { Inject, Injectable } from '@nestjs/common';
import { DateEntity } from '../entities/date.entity';
import { ReportPort, REPORT_PORT } from '../ports/report.port';

@Injectable()
export class ReportUseCase {
  constructor(@Inject(REPORT_PORT) private readonly _reportPort: ReportPort) {}

  async report(from: Date, to: Date) {
    const fromDateEntity = new DateEntity(from);
    const toDateEntity = new DateEntity(to);

    return this._reportPort.report(fromDateEntity, toDateEntity);
  }
}
