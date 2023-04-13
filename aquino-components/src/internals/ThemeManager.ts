import type ComponentRef from './ComponentRef';
import type {AllEventsAsObject, AquinoEvents} from './EventManager';
import {type Draft} from 'immer';

type ThemeSetter<P, S> = (props: P) => S;
type ThemeDeps<P> = (props: P) => any[];
export type ThemeConfig<P, S> = {theme: ThemeSetter<P, S>; deps: ThemeDeps<P>};

export class ThemeExtensor<P = any, S = any> {
	private readonly _setter?: ThemeSetter<P, S>;
	private readonly _deps?: ThemeDeps<P>;

	public constructor();
	public constructor(setter: ThemeSetter<P, S>, deps: ThemeDeps<P>);
	public constructor(...args: unknown[]) {
		const [setter, deps] = args as [Nullable<ThemeSetter<P, S>>, ThemeDeps<P>];
		if (setter) {
			this._setter = setter;
			this._deps = deps;
		}
	}

	public theme() {
		if (!this._setter) return null;
		if (!this._deps) return null;
		return {
			theme: this._setter,
			deps: this._deps,
		};
	}
}

type ThemeValue = string | ThemeExtensor;

export type Theme = {
	[key: string]: ThemeValue | [ThemeValue, Theme];
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

export interface Themeable<P, S extends Theme = Theme> {
	theme?: ThemeConfig<P, S>;
}

export interface AquinoTemplateProps_<E extends HTMLElement = HTMLElement> {
	el: ReactElementRef<E>;
	events: Partial<AllEventsAsObject>;
}

export type AquinoComponentProps<B extends AquinoBehavior<any, any>> = Omit<Props<B>, 'Template'>;

export interface AquinoBehaviorProps_<T extends AquinoTemplate<any>, R = {}> {
  innerRef?: ComponentRef<Exclude<Props<T>['el']['current'], null>, R>;
}

export type AquinoBehaviorProps<
	P,
	T extends AquinoTemplate<P>,
	R = {},
> = P 
	& AquinoBehaviorProps_<T, R>;

export type AquinoTemplateProps<
	P,
	E extends HTMLElement = HTMLElement, 
	S extends Theme = Theme,
> = P 
	& AquinoTemplateProps_<E> 
	& Themeable<P, S>;

export type AquinoComponent<B extends AquinoBehavior<any, any>> = React.FC<AquinoComponentProps<B>>;

export type AquinoTemplate<
	P, 
	E extends HTMLElement = HTMLElement, 
	S extends Theme = Theme,
> = React.FC<AquinoTemplateProps<P, E, S>> & {
	readonly id: Symbol;
	theme: (theme: ThemeConfig<P, S>) => void;
	extends: (theme?: ThemeConfig<P, S>) => ThemeExtensor<P, S>;
};

export type AquinoBehavior<P, T extends AquinoTemplate<any, any, any>, R = {}> = React.FC<AquinoBehaviorProps<P, T, R> & {
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
