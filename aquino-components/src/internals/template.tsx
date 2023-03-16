import {useMemo} from 'react';
import styleManager, {type AquinoTemplate, type Theme, type AquinoTemplateProps, type ThemeConfig} from './ThemeManager';

function template<
	TP,
	E extends HTMLElement = HTMLElement,
	S extends Theme = Theme,
>(
	component: (props: TP & AquinoTemplateProps<E>, style: S | undefined) => React.ReactNode,
	initialStyleValue: S,
): AquinoTemplate<TP & AquinoTemplateProps<E>, S> {
	type TemplateProps = TP & AquinoTemplateProps<E>;

	const c: any = (props: TemplateProps): React.ReactNode => {
		const theme = props.theme?.() ?? styleManager.getStyle(c.id)?.();
		const style = useMemo(() => theme?.theme(props), theme?.deps(props)) as S;
		return component(props, style);
	};

	c.id = Symbol('');
	c.theme = (style: ThemeConfig<AquinoTemplateProps, Theme>) => styleManager.setStyle(c.id, style);
	
	styleManager.setStyle(c.id, () => ({
		theme: () => initialStyleValue,
		deps: () => [],
	}));
  
	return c as AquinoTemplate<TemplateProps, S>;
}

export default template;
