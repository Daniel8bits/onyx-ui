import React, {useMemo} from 'react';
import styleManager, {
	type AquinoTemplate, 
	type Theme, 
	type AquinoTemplateProps, 
	type ThemeConfig, 
	ThemeExtensor, 
} from './ThemeManager';
import {observer} from 'mobx-react-lite';
import {createStyle} from './AquinoStyles';

function template<
	P,
	E extends HTMLElement = HTMLElement,
	S extends Theme = Theme,
>(params: {
	name: string;
	jsx: (props: AquinoTemplateProps<P, E, S>, data: {theme: S | undefined; dataAquino: string}) => React.ReactNode;
	theme: S;
	css?: string;
}): AquinoTemplate<P, E, S> {
	type TemplateProps = AquinoTemplateProps<P, E, S>;

	const d: React.FC<TemplateProps> = props => {
		const themeGetter = props.theme ?? styleManager.getStyle(c.id);
		const theme = useMemo(() => themeGetter?.theme(props), themeGetter?.deps(props)) as S;
		return <>{params.jsx(props, {theme, dataAquino: params.name})}</>;
	};

	const c: any = observer(d);
	c.id = Symbol('');
	c.theme = (style: ThemeConfig<AquinoTemplateProps<any>, Theme>) => styleManager.setStyle(c.id, style);
	c.extends = (theme?: ThemeConfig<AquinoTemplateProps<any>, Theme>) => 
		theme 
		? new ThemeExtensor(theme.theme, theme.deps) 
		: new ThemeExtensor();
	
	if (params.css) createStyle('aquino-' + params.name, params.css);

	styleManager.setStyle(c.id, {
		theme: () => params.theme,
		deps: () => [],
	});
  
	return c as AquinoTemplate<P, E, S>;
}

export default template;
