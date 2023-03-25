import type ComponentRef from './ComponentRef';
import type {OnyxEvents, OnyxMouseEventCallback} from './EventManager';
import {type Draft} from 'immer';

export type Theme = {
	[key: string]: string | [string, Theme];
};

/* .
export type ThemeDraft<T extends Theme> = Partial<{
	[key in keyof T]: 
		T[key] extends string 
			? string 
			: T[key] extends [string, Theme] 
			? [string, ThemeDraft<T[key][1]>] 
			: undefined
}>;
*/

type ThemeSetter<P, S> = (props: P) => S;
type ThemeDeps<P> = (props: P) => any[];
export type ThemeConfig<P, S> = () => {theme: ThemeSetter<P, S>; deps: ThemeDeps<P>};

export interface Themeable<P, S extends Theme = Theme> {
	theme?: ThemeConfig<P, S>;
}

export interface AquinoComponentProps_ {
  innerRef?: ComponentRef;
}

export interface AquinoTemplateProps_<E extends HTMLElement = HTMLElement> {
	el: ReactElementRef<E>;
	events: Partial<Record<OnyxEvents, OnyxMouseEventCallback>>;
}

export type AquinoComponentProps<
	P,
	S extends Theme = Theme,
	T = P,
> = P 
	& AquinoComponentProps_
	& Themeable<T, S>;

export type AquinoTemplateProps<
	P,
	E extends HTMLElement = HTMLElement, 
	S extends Theme = Theme,
> = P 
	& AquinoTemplateProps_<E> 
	& Themeable<P, S>;

export type AquinoComponent<P, S extends Theme, T = P> = React.FC<AquinoComponentProps<P, S, T>>;

export type AquinoTemplate<P, S extends Theme> = React.FC<P> & {
	readonly id: Symbol;
	theme: (theme: ThemeConfig<P, S>) => void;
};

export type AquinoBehavior<P, T, S extends Theme> = React.FC<AquinoComponentProps<P, S, Omit<Props<T>, keyof (AquinoTemplateProps_ & Themeable<P>)>> & {
	Template: React.FC<Props<T>>;
}>;

class StyleManager {
	private readonly _styles: Map<Symbol, ThemeConfig<AquinoTemplateProps<any>, Theme>>;

	constructor() {
		this._styles = new Map();
	}

	public setStyle(id: Symbol, style: ThemeConfig<AquinoTemplateProps<any>, Theme>) {
		this._styles.set(id, style);
	}

	public getStyle(id: Symbol) {
		return this._styles.get(id);
	}
}

const styleManager = new StyleManager();

export default styleManager;
