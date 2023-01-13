

type CustomElement<T> = Partial<T & React.DOMAttributes<T> & { children: any }>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['onyx-datepicker']: CustomElement<HTMLDivElement>;
    }
  }
}