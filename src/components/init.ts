import OnyxUICustomTags from "./tags"


class OnyxCustomDivTag extends HTMLDivElement {
  constructor() {
    super()
    const shadow = this.attachShadow({mode: "closed"})
    shadow.appendChild(document.createElement('slot'))
  }
}

class OnyxCustomButtonTag extends HTMLButtonElement {
  constructor() {
    super()
    const shadow = this.attachShadow({mode: "closed"})
    shadow.appendChild(document.createElement('slot'))
  }
}

export default function init() {
  customElements.define(OnyxUICustomTags.datepicker, class extends OnyxCustomDivTag {}, {extends: 'div'})
  customElements.define(OnyxUICustomTags.popover, class extends OnyxCustomDivTag {}, {extends: 'div'})
  customElements.define(OnyxUICustomTags.button, class extends OnyxCustomButtonTag {}, {extends: 'button'})
}