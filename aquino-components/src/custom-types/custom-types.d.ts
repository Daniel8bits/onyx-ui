declare type Nullable<T> = T | null | undefined;

declare type AnyObject = Record<string, unknown>;

declare type StateSetter<T> = (value: T | undefined | ((oldValue: T | undefined) => T | undefined)) => void;

declare type Override<T, R> = Omit<T, keyof R> & R;

declare type Class<T> = new (...args: any[]) => T;

declare type ReactElementRef<T extends HTMLElement = HTMLElement> = React.MutableRefObject<T | null>;

declare type Props<T> = Parameters<T>[0];

type ComponentRefType_<T> = Props<T>['innerRef'];
declare type ComponentRefType<T> = Exclude<Parameters<Exclude<ComponentRefType_<T>, undefined>>[0], (...args: any[]) => any>;
