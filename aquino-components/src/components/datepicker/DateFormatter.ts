import type ExtendedDate from './ExtendedDate';

export enum ExtendedDateLocale {
  PT_BR = 'pt_br', 
  EN_US = 'en_us',
}

const monthNameList: Map<ExtendedDateLocale, string[]> = new Map<ExtendedDateLocale, string[]>();

monthNameList.set(
  ExtendedDateLocale.PT_BR,
  [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ],
);

monthNameList.set(
  ExtendedDateLocale.EN_US,
  [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
);

class DateFormatter {
  private _date: ExtendedDate;
  private _locale: ExtendedDateLocale;

  constructor(date: ExtendedDate, locale?: ExtendedDateLocale) {
    this._date = date;
    this._locale = locale ?? date.getLocale();
  }

  public setDate(date: ExtendedDate) {
    this._date = date;
  }

  public setLocale(locale: ExtendedDateLocale) {
    this._locale = locale;
  }

  public getMonthName(month?: number): string {
    return monthNameList.get(this._locale)![month === undefined ? this._date.getMonth() : month % 12];
  }

  /*
    02/05/1990
    <d> = 02, <d1> = 2, <dE> = 2nd/Dia 2
    <m> = 05, <m1> = 5, <mE> = May/Maio
    <a> = 1990
    <x> = qualquer valor
    
    Ex:
    
    <a>/<m>/<d> = 1990/05/02
    <mE> <dE>, <a> = May 2nd, 1990
  */
  /**
   * 02/05/1990
   * 
   * &lt;d&gt; = 02, &lt;d1&gt; = 2, &lt;dE&gt; = 2nd/Dia 2
   * 
   * &lt;m&gt; = 05, &lt;m1&gt; = 5, &lt;mE&gt; = May/Maio
   * 
   * &lt;y&gt; = 1990
   * 
   * &lt;x&gt; = qualquer valor
   * 
   * Ex:
   * 
   * &lt;y&gt;/&lt;m&gt;/&lt;d&gt; = 1990/05/02
   * 
   * &lt;mE&gt; &lt;dE&gt;, &lt;y&gt; = May 2nd, 1990
   * 
   * @param format 
   * @returns 
   */
  public format(format = '<y>-<m>-<d>', stack: Array<string | number | boolean> = []): string {
    stack?.reverse();
    const text: [string] = [''];
    let escaped = false;
    for (let i = 0; i < format.length; i++) {
      const c1 = format[i];
      const c2 = format[i + 1];
      const c3 = format[i + 2];
      const c4 = format[i + 3];
      const c5 = format[i + 4];

      if (!escaped && c1 && c2 && c3) {
        // Day
        if (this._formatDay(text, [c1, c2, c3, c4], this._date.getDay())) {
          i = format.indexOf('>', i);
          continue;
        }
        
        // Month
        if (this._formatMonth(text, [c1, c2, c3, c4], this._date.getMonth())) {
          i = format.indexOf('>', i);
          continue;
        }
  
        // Year
        if (this._formatYear(text, [c1, c2, c3], this._date.getYear())) {
          i = format.indexOf('>', i);
          continue;
        }

        // Variable
        if (this._formatVariable(text, [c1, c2, c3, c4, c5], stack)) {
          i = format.indexOf('>', i);
          continue;
        }
      }

      if (!escaped && c1 === '\\') {
        escaped = true;
        continue;
      }
      
      if (c1) text[0] += c1;
      escaped = false;
    }

    return text[0];
  }
  
  // eslint-disable-next-line complexity
  private _formatDay(text: [string], c: string[], day: number): boolean {
    if (c[0] === '<' && c[1] === 'd' && c[2] === '>') {
      text[0] += day < 10 ? `0${day}` : String(day);
      return true;
    } 

    if (c[0] === '<' && c[1] === 'd' && c[2] === '1' && c[3] === '>') {
      text[0] += String(day);
      return true;
    }

    if (c[0] === '<' && c[1] === 'd' && c[2] === 'E' && c[3] === '>') {
      if (this._locale === ExtendedDateLocale.PT_BR) {
        text[0] += `Dia ${day}`;
        return true;
      }

      text[0] += String(day);
      if (day === 1 || day === 21 || day === 31) text[0] += 'st';
      else if (day === 2 || day === 22) text[0] += 'nd';
      else if (day === 3 || day === 23) text[0] += 'rd';
      else text[0] += 'th';
      return true;
    }

    return false;
  }

  private _formatMonth(text: [string], c: string[], month: number): boolean {
    if (c[0] === '<' && c[1] === 'm' && c[2] === '>') {
      text[0] += month < 9 ? `0${month + 1}` : String(month + 1);
      return true;
    } 

    if (c[0] === '<' && c[1] === 'm' && c[2] === '1' && c[3] === '>') {
      text[0] += String(month);
      return true;
    }

    if (c[0] === '<' && c[1] === 'm' && c[2] === 'E' && c[3] === '>') {
      text[0] += this.getMonthName(month);
      return true;
    }

    return false;
  }

  private _formatYear(text: [string], c: string[], year: number): boolean {
    if (c[0] === '<' && c[1] === 'y' && c[2] === '>') {
      text[0] += String(year);
      return true;
    }

    return false;
  }

  // eslint-disable-next-line complexity
  private _formatVariable(text: [string], c: string[], stack: Array<string | number | boolean>): boolean {
    if (stack.length === 0) return false;

    if (c[0] === '<' && c[1] === 'x' && c[2] === '>') {
      text[0] += String(stack.pop());
      return true;
    }

    if (c[0] === '<' && c[1] === 'x' && c[2] === 'd') {
      const value = stack.pop();
      if (typeof value !== 'number') throw new Error('DateFormatter: <xd>, <xd1> and <xdE> requires number');

      if (c[3] === '>') {
        if (this._formatDay(text, [c[0], c[2], c[3]], value)) return true;
      } else if (c[3] === '1' && c[4] === '>') {
        if (this._formatDay(text, [c[0], c[2], c[3], c[4]], value)) return true;
      } else if (c[3] === 'E' && c[4] === '>') {
        if (this._formatDay(text, [c[0], c[2], c[3], c[4]], value)) return true;
      }

      stack.push(value);
    }

    if (c[0] === '<' && c[1] === 'x' && c[2] === 'm') {
      const value = stack.pop();
      if (typeof value !== 'number') throw new Error('DateFormatter: <xm>, <xm1> and <xmE> requires number');

      if (c[3] === '>') {
        if (this._formatMonth(text, [c[0], c[2], c[3]], value)) return true;
      } else if (c[3] === '1' && c[4] === '>') {
        if (this._formatMonth(text, [c[0], c[2], c[3], c[4]], value)) return true;
      } else if (c[3] === 'E' && c[4] === '>') {
        if (this._formatMonth(text, [c[0], c[2], c[3], c[4]], value)) return true;
      }

      stack.push(value);
    }

    if (c[0] === '<' && c[1] === 'x' && c[2] === 'y' && c[3] === '>') {
      const value = stack.pop();
      if (typeof value !== 'number') throw new Error('DateFormatter: <xy> requires number');

      if (this._formatYear(text, [c[0], c[2], c[3]], value)) return true;

      stack.push(value);
    }

    return false;
  }
}

export default DateFormatter;
