
declare type Nullable<T> = T | null | undefined

declare type AnyObject = Record<string, unknown>

declare type StateSetter<T> = (value: T|((oldValue: T) => T)) => void

declare type Override<T, R> = Omit<T, keyof R> & R

declare type Class<T> = new (...args: any[]) => T