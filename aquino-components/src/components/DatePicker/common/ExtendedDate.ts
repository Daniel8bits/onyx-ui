import DateFormatter, {ExtendedDateLocale} from './DateFormatter';

class ExtendedDate {
  public static minYear = 1915;

  public static getLastDateOf(month: number, year: number): ExtendedDate {
    const auxMonth = Math.abs(month + 1) % 12;
    const auxYear = Math.floor(Math.abs(month + 1) / 12);
    if (month < 0) {
      month = 12 - auxMonth - 1;
      year -= auxYear + 1;
    } else if (month > 11) {
      month = auxMonth - 1;
      year += auxYear;
    }

    return new ExtendedDate(40, month, year);
  }

  public static now(): ExtendedDate {
    const date = new Date();
    return new ExtendedDate(date.getDate(), date.getMonth(), date.getFullYear());
  }

  /*
  Patterns dd/MM/yyyy and yyyy/MM/dd
  */
  public static parse(value: string): ExtendedDate | never {
    if (value.match(/^\d{4}\/\d{2}\/\d{2}$/g)) {
      const dateArr = value.split('/');
      return new ExtendedDate(Number(dateArr[2]), Number(dateArr[1]) - 1, Number(dateArr[0]));
    }

    if (value.match(/^\d{2}\/\d{2}\/\d{4}$/g)) {
      const dateArr = value.split('/');
      return new ExtendedDate(Number(dateArr[0]), Number(dateArr[1]) - 1, Number(dateArr[2]));
    }

    throw new Error('Invalid date format');
  }

  private _day: number;
  private _month: number;
  private _year: number;
  private _locale: ExtendedDateLocale;
  private readonly _formatter: DateFormatter;

  constructor(day: number, month: number, year: number, locale = ExtendedDateLocale.EN_US) {
    this._day = day;
    this._month = month;
    this._year = year;
    this._locale = locale;
    this._formatter = new DateFormatter(this);
    this.fix();
  }

  public getDay(): number {
    return this._day;
  }

  public setDay(day: number): void {
    this._day = day;
    this.fix();
  }

  public getMonth(): number {
    return this._month;
  }

  public setMonth(month: number): void {
    this._month = month;
    this.fix();
  }

  public getYear(): number {
    return this._year;
  }

  public setYear(year: number): void {
    this._year = year;
    this.fix();
  }

  public setLocale(locale: ExtendedDateLocale) {
    this._locale = locale;
  }

  public getLocale() {
    return this._locale;
  }

  public before(date: ExtendedDate): boolean {
    return !(
      this._year > date.getYear()
      || (this._year === date.getYear() && this._month > date.getMonth())
      || (this._year === date.getYear() && this._month === date.getMonth() && this._day >= date.getDay())
    );
  }

  public after(date: ExtendedDate): boolean {
    return !(
      this._year < date.getYear()
      || (this._year === date.getYear() && this._month < date.getMonth())
      || (this._year === date.getYear() && this._month === date.getMonth() && this._day <= date.getDay())
    );
  }

  public format(format = '<y>/<m>/<d>', stack: Array<string | number | boolean> = []): string {
    return this._formatter.format(format, stack);
  }

  public toString() {
    return this._formatter.format();
  }

  public getMonthName(): string {
    return this._formatter.getMonthName();
  }

  public isLeap(): boolean {
    return this._year % 4 === 0 && (this._year % 100 !== 0 || this._year % 400 === 0);
  }

  /*

    Reference: https://www.megacurioso.com.br/matematica-e-estatistica/44513-calendario-humano-como-transformar-seu-cerebro-em-uma-calculadora-de-datas.htm#:~:text=Tome%20como%20exemplo%20o%20dia,foi%20em%20uma%20sexta%2Dfeira.

  */
  public getDayOfWeek() {
    const a = Math.floor(this._year / 4);
    const b = Math.floor(this._year / 100);
    const c = Math.floor(this._year / 400);

    const leapYearsAmount = a - b + c;

    let daysAmount = leapYearsAmount * 366 + (this._year - leapYearsAmount) * 365;

    const dayPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    for (let i = 0; i < this._month; i++) {
      daysAmount += dayPerMonth[i];
    }

    if (this._month > 1 && this.isLeap()) {
      daysAmount++;
    }

    daysAmount += this._day - Number(this.isLeap());

    const dayOfWeek = daysAmount % 7;

    return dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  }

  // eslint-disable-next-line complexity
  private fix() {
    if (this._year < ExtendedDate.minYear) {
      this._year = ExtendedDate.minYear;
    }

    if (this._month < 0) {
      this._month = 0;
    } else if (this._month > 11) {
      this._month = 11;
    }

    switch (this._month) {
      case 0:
      case 2:
      case 4:
      case 6:
      case 7:
      case 9:
      case 11:
        if (this._day > 31) {
          this._day = 31;
        }

        break;
      case 3:
      case 5:
      case 8:
      case 10:
        if (this._day > 30) {
          this._day = 30;
        }

        break;
      case 1:
        if (this.isLeap() && this._day > 29) {
          this._day = 29;
        } else if (!this.isLeap() && this._day > 28) {
          this._day = 28;
        }

        break;
      default:
        break;
    }

    if (this._day < 1) {
      this._day = 1;
    }
  }
}

export default ExtendedDate;
