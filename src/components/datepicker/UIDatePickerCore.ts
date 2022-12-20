import UIComponentCore from "@components/UIComponentCore"
import UIObservable, { Observable } from "@components/UIObservable"
import UIDate from "./UIDate"

type ObservableProperties = 'minYear' | 'maxYear' | 'pivotYear' | 'yearsStep' | 'yearsRange' | 'value' | 'monthDays' | 'input'

class UIDatePickerCore extends UIComponentCore {

  private _minYear: UIObservable<number>
  private _maxYear: UIObservable<number>
  private _pivotYear: UIObservable<number>
  private _yearsStep: UIObservable<number>
  private _yearsRange: UIObservable<number[]>
  private _value: UIObservable<Nullable<UIDate>>
  private _monthDays: UIObservable<number[][]>
  private _input: UIObservable<Nullable<HTMLInputElement>>
  private _triggerAction: StateSetter<Nullable<UIDate>>

  private _inputKeyDownEvent!: () => void

  constructor(value: Nullable<UIDate>, triggerAction: StateSetter<Nullable<UIDate>>) {
    super()
    this._minYear     = new UIObservable(this, 'minYear',                       1915)
    this._maxYear     = new UIObservable(this, 'maxYear',   new Date().getFullYear())
    this._pivotYear   = new UIObservable(this, 'pivotYear',      this._maxYear.get())
    this._yearsStep   = new UIObservable(this, 'yearsStep',                       28)
    this._yearsRange  = new UIObservable(this, 'yearsRange')
    this._value       = new UIObservable(this, 'value',                        value)
    this._monthDays   = new UIObservable(this, 'monthDays')
    this._input       = new UIObservable(this, 'input')
    this._triggerAction = triggerAction

    this.setValue = this.setValue.bind(this)
    this.setInput = this.setInput.bind(this)
    this.destroy = this.destroy.bind(this)
    this.setDateByDay = this.setDateByDay.bind(this)
    this.setDateByMonth = this.setDateByMonth.bind(this)
    this.setDateByYear = this.setDateByYear.bind(this)
    this.decrementMonth = this.decrementMonth.bind(this)
    this.incrementMonth = this.incrementMonth.bind(this)
    this.decrementYear = this.decrementYear.bind(this)
    this.incrementYear = this.incrementYear.bind(this)

    this._setEvents()
    this._calculateMonthDays()
    this._calculateYearsRange()
  }

  private _setEvents() {
    this._inputKeyDownEvent = () => {
      const input = this._input.get()
      if(!input) return
      try {
        this._triggerAction(UIDate.parse(input.value))
      } catch (e: unknown) {
        this._triggerAction(null as unknown as UIDate)
      }
    }
  }

  public get value() {
    return this._value
  }

  public setValue(value: Nullable<UIDate>) {
    this._value.set(value)
    
    this.setInput(this._input.get())
    this._calculateMonthDays()
    this._triggerAction(value)
  }

  public setInput(input: Nullable<HTMLInputElement>) {
    this.destroy()
    this._input.set(input)
    const value = this._value.get()
    if(input && value) {
      input.value = value.getFormattedDate()
      input.addEventListener('keydown', this._inputKeyDownEvent)
    }
  }

  public destroy() {
    this._input.get()?.removeEventListener('keydown', this._inputKeyDownEvent)
  }

  // WEEK PANEL

  private _calculateMonthDays() {
    const currentMonth = this.getCurrentDate()
    const weeks = []
    const currentMonthLastDate = UIDate.getLastDateOf(currentMonth.getMonth(), currentMonth.getYear())
    const previousMonth = UIDate.getLastDateOf(currentMonth.getMonth() - 1, currentMonth.getYear())
    const day1Week = new UIDate(
      1,
      currentMonth.getMonth(),
      currentMonth.getYear()
    ).getDayOfWeek()
    // filling with current month days
    for (let i = day1Week, day = 1; day < currentMonthLastDate.getDay() + 1; i++, day++) {
      weeks[i] = day
    }
    // filling with previous month days
    for (let i = day1Week - 1, day = previousMonth.getDay(); i >= 0; i--, day--) {
      weeks[i] = -day
    }
    // filling with next month days
    for (let i = day1Week + currentMonthLastDate.getDay(), day = 1; i < 42; i++, day++) {
      weeks[i] = day + 100
    }
    
    const monthDays: number[][] = []
    for (let i = 0; i < 6; i++) {
      monthDays[i] = []
      for (let j = 0; j < 7; j++) {
        monthDays[i][j] = weeks[7 * i + j]
      }
    }
    
    this._monthDays.set(monthDays)
  }

  public get monthDays() {
    return this._monthDays
  }

  public setDateByDay(day: number) {
    const currentMonth = this.getCurrentDate()
    let month = currentMonth.getMonth()
    let year = currentMonth.getYear()
                    
    if (day < 0) {
      const auxDate = UIDate.getLastDateOf(month - 1, year)
      day = Math.abs(day)
      month = auxDate.getMonth()
      year = auxDate.getYear()
    }
    else if (day > 100) {
      const auxDate = UIDate.getLastDateOf(month + 1, year)
      day -= 100
      month = auxDate.getMonth()
      year = auxDate.getYear()
    }
                    
    this.setValue(new UIDate(day, month, year))
  }

  public normalizeWeekDay(encodedDay: number) {
    if (encodedDay < 0) {
      return Math.abs(encodedDay)
    }
    else if (encodedDay > 100) {
      return encodedDay -= 100
    }
    return encodedDay
  }

  public decrementMonth() {
    const currentMonth = this.getCurrentDate()
    const newDate = UIDate.getLastDateOf(currentMonth.getMonth() - 1, currentMonth.getYear())
    this.setValue(new UIDate(
      currentMonth.getDay(),
      newDate.getMonth(),
      newDate.getYear()
    ))
  }
                        
  public incrementMonth() {
    const currentMonth = this.getCurrentDate()
    const newDate = UIDate.getLastDateOf(currentMonth.getMonth() + 1, currentMonth.getYear())
    this.setValue(new UIDate(
      currentMonth.getDay(),
      newDate.getMonth(),
      newDate.getYear()
    ))
  }

  public getCurrentDate() {
    return this._value.get() ?? UIDate.now()
  }

  // MONTHS PANEL

  public setDateByMonth(month: number) {
    const activeMonth = this.getCurrentDate()
    this.setValue(new UIDate(
      activeMonth.getDay(),
      month,
      activeMonth.getYear()
    ))
  }

  // YEAR PANEL

  public get yearsRange() {
    return this._yearsRange
  }

  public get yearsStep() {
    return this._yearsStep
  }

  private _calculateYearsRange() {
    const pivot = this._pivotYear.get()
    const step = this._yearsStep.get()
    if(!pivot || !step) return
    const yearsRange = []
    for (let i = pivot - (step-1); i <= pivot; i++) {
      yearsRange.push(i)
    }
    this._yearsRange.set(yearsRange)
  }

  public setDateByYear(year: number) {
    const activeYear = this.getCurrentDate()
    this.setValue(new UIDate(
      activeYear.getDay(),
      activeYear.getMonth(),
      year
    ))
  }

  public decrementYear() {
    const pivot = this._pivotYear.get()
    const step = this._yearsStep.get()
    const min = this._minYear.get()
    if(!pivot || !step || !min) return
    if(pivot === min) return
    const newYear = pivot - step
    if (pivot >= min) {
      this._pivotYear.set(newYear)
      this._calculateYearsRange()
      return
    }
    this._pivotYear.set(min)
    this._calculateYearsRange()
  }
      
  public incrementYear() {
    const pivot = this._pivotYear.get()
    const step = this._yearsStep.get()
    const max = this._maxYear.get()
    if(!pivot || !step || !max) return
    if(pivot === max) return
    const newYear = pivot + step
    if (newYear <= max) {
      this._pivotYear.set(newYear);
      this._calculateYearsRange()
      return
    }
    this._pivotYear.set(max)
    this._calculateYearsRange()
  }

  public subscribe(properties: ObservableProperties[], componentUpdater: () => void): void {
    super.subscribe(properties, componentUpdater)
  }

  public unsubscribe(properties: ObservableProperties[], componentUpdater: () => void): void {
    super.unsubscribe(properties, componentUpdater)
  }
}

export default UIDatePickerCore