import {useMemo} from 'react';
import styleManager, {type AquinoTemplate, type Theme, type AquinoTemplateProps, type ThemeConfig} from './ThemeManager';

function template<
	P,
	E extends HTMLElement = HTMLElement,
	S extends Theme = Theme,
>(
	component: (props: AquinoTemplateProps<P, E, S>, style: S | undefined) => React.ReactNode,
	initialStyleValue: S,
): AquinoTemplate<AquinoTemplateProps<P, E, S>, S> {
	type TemplateProps = AquinoTemplateProps<P, E, S>;

	const c: any = (props: TemplateProps): React.ReactNode => {
		const theme = props.theme?.() ?? styleManager.getStyle(c.id)?.();
		const style = useMemo(() => theme?.theme(props), theme?.deps(props)) as S;
		return component(props, style);
	};

	c.id = Symbol('');
	c.theme = (style: ThemeConfig<AquinoTemplateProps<any>, Theme>) => styleManager.setStyle(c.id, style);
	
	styleManager.setStyle(c.id, () => ({
		theme: () => initialStyleValue,
		deps: () => [],
	}));
  
	return c as AquinoTemplate<TemplateProps, S>;
}

export default template;
