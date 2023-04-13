import ComponentCore from '@components/ComponentCore';
import Observable from '@components/Observable';
import ExtendedDate from './ExtendedDate';

type ObservableProperties = 'minYear' | 'maxYear' | 'pivotYear' | 'yearsStep' | 'yearsRange' | 'value' | 'monthDays' | 'input';

class DatePickerCore extends ComponentCore {
  private readonly _minYear: Observable<number>;
  private readonly _maxYear: Observable<number>;
  private readonly _pivotYear: Observable<number>;
  private readonly _yearsStep: Observable<number>;
  private readonly _yearsRange: Observable<number[]>;
  private readonly _value: Observable<Nullable<ExtendedDate>>;
  private readonly _monthDays: Observable<number[][]>;
  private readonly _input: Observable<Nullable<(v?: string) => string>>;
  private readonly _triggerAction: StateSetter<Nullable<ExtendedDate>>;

  private _inputKeyUpEvent!: () => void;

  constructor(value: Nullable<ExtendedDate>, triggerAction: StateSetter<Nullable<ExtendedDate>>) {
    super();
    this._minYear = new Observable(this, 'minYear', 1915);
    this._maxYear = new Observable(this, 'maxYear', new Date().getFullYear());
    this._yearsStep = new Observable(this, 'yearsStep', 28);
    this._pivotYear = new Observable(this, 'pivotYear', this._maxYear.get());
    this._yearsRange = new Observable(this, 'yearsRange');
    this._value = new Observable(this, 'value', value);
    this._monthDays = new Observable(this, 'monthDays');
    this._input = new Observable(this, 'input');
    this._triggerAction = triggerAction;

    this.setValue = this.setValue.bind(this);
    this.setInput = this.setInput.bind(this);
    this.setDateByDay = this.setDateByDay.bind(this);
    this.setDateByMonth = this.setDateByMonth.bind(this);
    this.setDateByYear = this.setDateByYear.bind(this);
    this.decrementMonth = this.decrementMonth.bind(this);
    this.incrementMonth = this.incrementMonth.bind(this);
    this.decrementYear = this.decrementYear.bind(this);
    this.incrementYear = this.incrementYear.bind(this);

    this._setEvents();
    this._calculateMonthDays();
    this._calculateYearPivot();
    this._calculateYearsRange();
  }

  public get value() {
    return this._value;
  }

  public setValue(value: Nullable<ExtendedDate>) {
    this._value.set(value);
    
    this.setInput(this._input.get());
    this._calculateMonthDays();
    this._calculateYearPivot();
    this._calculateYearsRange();
    this._triggerAction(value);
  }

  public setInput(input: Nullable<(v?: string) => string>) {
    this._input.set(input);
    const value = this._value.get();
    if (input && value) {
      input(value.format('<y>/<m>/<d>'));
    }
  }

  public getInputKeyUpEvent() {
    return this._inputKeyUpEvent;
  }

  public get monthDays() {
    return this._monthDays;
  }

  public setDateByDay(day: number) {
    const currentMonth = this.getCurrentDate();
    let month = currentMonth.getMonth();
    let year = currentMonth.getYear();

    if (day < 0) {
      const auxDate = ExtendedDate.getLastDateOf(month - 1, year);
      day = Math.abs(day);
      month = auxDate.getMonth();
      year = auxDate.getYear();
    } else if (day > 100) {
      const auxDate = ExtendedDate.getLastDateOf(month + 1, year);
      day -= 100;
      month = auxDate.getMonth();
      year = auxDate.getYear();
    }

    this.setValue(new ExtendedDate(day, month, year));
  }

  public normalizeWeekDay(encodedDay: number) {
    if (encodedDay < 0) {
      return Math.abs(encodedDay);
    }

    if (encodedDay > 100) {
      return encodedDay - 100;
    }

    return encodedDay;
  }

  public decrementMonth() {
    const currentMonth = this.getCurrentDate();
    const newDate = ExtendedDate.getLastDateOf(currentMonth.getMonth() - 1, currentMonth.getYear());
    this.setValue(new ExtendedDate(
      currentMonth.getDay(),
      newDate.getMonth(),
      newDate.getYear(),
    ));
  }

  public incrementMonth() {
    const currentMonth = this.getCurrentDate();
    const newDate = ExtendedDate.getLastDateOf(currentMonth.getMonth() + 1, currentMonth.getYear());
    this.setValue(new ExtendedDate(
      currentMonth.getDay(),
      newDate.getMonth(),
      newDate.getYear(),
    ));
  }

  public getCurrentDate() {
    return this._value.get() ?? ExtendedDate.now();
  }

  // MONTHS PANEL

  public setDateByMonth(month: number) {
    const activeMonth = this.getCurrentDate();
    this.setValue(new ExtendedDate(
      activeMonth.getDay(),
      month,
      activeMonth.getYear(),
    ));
  }

  // YEAR PANEL

  public get yearsRange() {
    return this._yearsRange;
  }

  public get yearsStep() {
    return this._yearsStep;
  }

  public setDateByYear(year: number) {
    const activeYear = this.getCurrentDate();
    this.setValue(new ExtendedDate(
      activeYear.getDay(),
      activeYear.getMonth(),
      year,
    ));
  }

  public decrementYear() {
    const pivot = this._pivotYear.get();
    const step = this._yearsStep.get();
    const min = this._minYear.get();
    if (!pivot || !step || !min) {
      return;
    }

    if (pivot === min) {
      return;
    }

    const newYear = pivot - step;
    if (pivot >= min) {
      this._pivotYear.set(newYear);
      this._calculateYearsRange();
      return;
    }

    this._pivotYear.set(min);
    this._calculateYearsRange();
  }

  public incrementYear() {
    const pivot = this._pivotYear.get();
    const step = this._yearsStep.get();
    const max = this._maxYear.get();
    if (!pivot || !step || !max) {
      return;
    }

    if (pivot === max) {
      return;
    }

    const newYear = pivot + step;
    if (newYear <= max) {
      this._pivotYear.set(newYear);
      this._calculateYearsRange();
      return;
    }

    this._pivotYear.set(max);
    this._calculateYearsRange();
  }

  public subscribe(properties: ObservableProperties[], componentUpdater: () => void): void {
    super.subscribe(properties, componentUpdater);
  }

  public unsubscribe(properties: ObservableProperties[], componentUpdater: () => void): void {
    super.unsubscribe(properties, componentUpdater);
  }

  private _calculateMonthDays() {
    const currentMonth = this.getCurrentDate();
    const weeks = [];
    const currentMonthLastDate = ExtendedDate.getLastDateOf(currentMonth.getMonth(), currentMonth.getYear());
    const previousMonth = ExtendedDate.getLastDateOf(currentMonth.getMonth() - 1, currentMonth.getYear());
    const day1Week = new ExtendedDate(
      1,
      currentMonth.getMonth(),
      currentMonth.getYear(),
    ).getDayOfWeek();
    // Filling with current month days
    for (let i = day1Week, day = 1; day < currentMonthLastDate.getDay() + 1; i++, day++) {
      weeks[i] = day;
    }

    // Filling with previous month days
    for (let i = day1Week - 1, day = previousMonth.getDay(); i >= 0; i--, day--) {
      weeks[i] = -day;
    }

    // Filling with next month days
    for (let i = day1Week + currentMonthLastDate.getDay(), day = 1; i < 42; i++, day++) {
      weeks[i] = day + 100;
    }

    const monthDays: number[][] = [];
    for (let i = 0; i < 6; i++) {
      monthDays[i] = [];
      for (let j = 0; j < 7; j++) {
        monthDays[i][j] = weeks[(7 * i) + j];
      }
    }

    this._monthDays.set(monthDays);
  }

  private _setEvents() {
    this._inputKeyUpEvent = () => {
      const input = this._input.get();
      if (!input) {
        return;
      }

      try {
        this._triggerAction(ExtendedDate.parse(input()));
      } catch (e: unknown) {
        this._triggerAction(null as unknown as ExtendedDate);
      }
    };
  }

  private _calculateYearPivot() {
    const currentPivot = this._pivotYear.get()!;
    const step = this._yearsStep.get()!;
    const value = this._value.get();
    const pivot = value ? currentPivot - step * Math.floor((currentPivot - value.getYear()) / step) : this._maxYear.get();
    this._pivotYear.set(pivot);
  }

  private _calculateYearsRange() {
    const pivot = this._pivotYear.get();
    const step = this._yearsStep.get();
    if (!pivot || !step) {
      return;
    }

    const yearsRange = [];
    for (let i = pivot - (step - 1); i <= pivot; i++) {
      yearsRange.push(i);
    }

    this._yearsRange.set(yearsRange);
  }
}

export default DatePickerCore;
