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

export interface AquinoComponentProps<P, S extends Theme = Theme> extends JSX.IntrinsicAttributes {
	theme?: ThemeConfig<P & AquinoTemplateProps, S>;
  innerRef?: ComponentRef;
}

export type AquinoTemplate<P extends AquinoTemplateProps, S extends Theme> = React.FC<P> & {
	readonly id: Symbol;
	theme: (theme: ThemeConfig<P, S>) => void;
};

export interface AquinoTemplateProps<E extends HTMLElement = HTMLElement> extends AquinoComponentProps<AquinoTemplateProps> {
	el: ReactElementRef<E>;
	events: Partial<Record<OnyxEvents, OnyxMouseEventCallback>>;
}

interface ComponentStyle extends Theme {
	div: [
		string,
		{
			div: string;
			span: string;
		},
	];
}

class StyleManager {
	private readonly _styles: Map<Symbol, ThemeConfig<AquinoTemplateProps, Theme>>;

	constructor() {
		this._styles = new Map();
	}

	public setStyle(id: Symbol, style: ThemeConfig<AquinoTemplateProps, Theme>) {
		this._styles.set(id, style);
	}

	public getStyle(id: Symbol) {
		return this._styles.get(id);
	}
}

const styleManager = new StyleManager();

export default styleManager;
