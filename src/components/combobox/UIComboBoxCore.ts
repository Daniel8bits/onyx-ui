export type UIComboItemData = { value: string, label: string }
export type UIComboItemType = UIComboItemData[] | { [key: string]: UIComboItemData[] }

class UIComboBoxCore {

  private _value: Nullable<UIComboItemData>
  private _height!: number | 'auto'
  private _items: UIComboItemType
  private _allowSearch: boolean
  private _input?: HTMLInputElement

  private _dividedByCategories: boolean

  private _categories!: Map<string, Set<UIComboItemData>>
  private _displayItems!: UIComboItemData[]

  private _componentUpdater: StateSetter<boolean>
  private _actionTrigger: StateSetter<Nullable<UIComboItemData>>

  private _onChange?: (core: UIComboBoxCore) => void
  private _onBlur?: (core: UIComboBoxCore) => void

  private _inputBlurEvent!: () => void

  constructor(
    value: Nullable<UIComboItemData>,
    items: UIComboItemType,
    allowSearch: boolean,
    actionTrigger: StateSetter<Nullable<UIComboItemData>>,
    componentUpdater: StateSetter<boolean>
  ) {
    this._items = items
    this._allowSearch = allowSearch ?? false
    this._value = value
    this._dividedByCategories = !(items instanceof Array)
    this._actionTrigger = actionTrigger

    this.search = this.search.bind(this)
    this.resetSearch = this.resetSearch.bind(this)
    this.recalculateComboBoxHeight = this.recalculateComboBoxHeight.bind(this)

    this._setEvents()
    this._resetCategorySets()
    this._resetDisplayItems()
    this._componentUpdater = componentUpdater
  }

  private _setEvents() {
    this._inputBlurEvent = () => {
      this.resetSearch()
      this._onBlur?.(this)
    }
  }

  private _resetDisplayItems() {
    this._displayItems = []
    if(this._items instanceof Array) {
      this._displayItems = this._displayItems.concat(this._items)
    } else {
      this._categories.forEach(set => {
        this._displayItems = this._displayItems.concat([...set.values()])
      })
    }
    this.recalculateComboBoxHeight()
  }

  private _resetCategorySets() {
    this._categories = new Map()
    if(this._items instanceof Array) return

    type CategorizedItems = Record<string, UIComboItemData[]>

    const items = this._items as CategorizedItems

    Object.keys(items).forEach((key: keyof CategorizedItems) => {
      const category = new Set<UIComboItemData>(items[key])
      this._categories.set(key, category)
    })
  }

  public setAllowSearch(allowSearch: boolean) {
    this._allowSearch = allowSearch
  }

  public setActionTrigger(actionTrigger: StateSetter<Nullable<UIComboItemData>>) {
    this._actionTrigger = actionTrigger
  }

  public setInput(input: Nullable<HTMLInputElement>) {
    if (input) {
      this._input = input
      input.value = this._value?.label ?? ''
      input.addEventListener('blur', this._inputBlurEvent)
    }
  }

  public setValue(value: Nullable<UIComboItemData>) {
    this._value = value
    this.setInput(this._input)
    this._actionTrigger(value)
    this._onChange?.(this)
  }

  public setItems(items: UIComboItemType) {
    this._items = items
    this._dividedByCategories = !(items instanceof Array)
    this._resetCategorySets()
    this._resetDisplayItems()
  }

  public clear() {
    this.setValue(null)
  }

  public recalculateComboBoxHeight() {
    const MAX_ITEMS_TO_BE_AUTO = 5
    this._height = this._displayItems.length <= MAX_ITEMS_TO_BE_AUTO ? 'auto' : 200
  }

  public search() {
    if(!this._allowSearch) return
    if(!this._input) return

    const input = this._input
    this._displayItems = []

    if (this._items instanceof Array) {

      this._displayItems = this._items.filter((item) => item.label.search(input.value) > -1)
      
    } else if (!(this._items instanceof Array)) {

      this._categories.forEach(set => {
        const items = [...set.values()].filter((item: UIComboItemData) => item.label.search(input.value) > -1)
        this._displayItems = this._displayItems.concat(items)
      })

    }

    this.recalculateComboBoxHeight()
    this._componentUpdater(v => !v)

  }

  public resetSearch() {
    if(!this._input) return
    this._input.value = this._value?.label ?? ''
    this._resetDisplayItems()
    this._componentUpdater(v => !v)
  }

  public destroy() {
    if(this._input) {
      this._input.removeEventListener('blur', this._inputBlurEvent)
    }
  }

  public get value() {
    return this._value
  }

  public get height() {
    return this._height
  }

  public get displayItems() {
    return this._displayItems
  }

  public get allowSearch() {
    return this._allowSearch
  }

  public get dividedByCategories() {
    return this._dividedByCategories
  }

  public get categories() {
    return this._categories
  }

  public onBlur(callback: (core: UIComboBoxCore) => void) {
    this._onBlur = callback
  }

  public onChange(callback: (core: UIComboBoxCore) => void) {
    this._onChange = callback
  }

}

export default UIComboBoxCore