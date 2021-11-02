const DAY_MILLISECONDS = 1000 * 60 * 60 * 24;

export class DateEntity {
  constructor(private readonly _date: Date) {}

  public get date(): Date {
    return this._date;
  }

  public format(): string {
    return `${this.date.getFullYear()}-${this.date.getMonth() + 1}-${this.date.getDate()}`;
  }

  public of(date: Date) {
    return new DateEntity(date);
  }

  public subtractDays(days: number): DateEntity {
    return new DateEntity(new Date(this.date.getTime() - DAY_MILLISECONDS * days));
  }

  public addDays(days: number): DateEntity {
    return new DateEntity(new Date(this.date.getTime() + DAY_MILLISECONDS * days));
  }

  public isWeekend(): boolean {
    return this.date.getDay() === 6 || this.date.getDay() === 0;
  }

  public static getDatesRangeInDays(a: DateEntity, b: DateEntity): number {
    return Math.floor((b.date.getTime() - a.date.getTime()) / DAY_MILLISECONDS);
  }
}
