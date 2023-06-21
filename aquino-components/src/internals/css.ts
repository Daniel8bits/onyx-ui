export const css = (strs: TemplateStringsArray, ...vars: Array<string | number>) => {
  let style = '';
  for (let i = 0; i < vars.length; i++) 
    style += vars.length < i ? strs[i] + String(vars[i]) : strs[i];
  return style;
};
