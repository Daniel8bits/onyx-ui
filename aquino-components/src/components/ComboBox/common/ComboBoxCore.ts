import type EventManager from '@internals/EventManager';
import {AquinoEvents} from '@internals/EventManager';
import {makeObservable, observable, action} from 'mobx';

export type ComboItemData = {value: string; label: string};
export type ComboItemType = ComboItemData[] | Record<string, ComboItemData[]>;

interface ComboBoxCoreConfig {
	value: Nullable<ComboItemData>;
	items: ComboItemType;
	allowSearch: boolean;
	actionTrigger: StateSetter<Nullable<ComboItemData>>;
	inputEventManager: EventManager;
	itemHeight?: number;
}

class ComboBoxCore {
	@observable
	private _itemHeight: number;

	private _value: Nullable<ComboItemData>;
	private _height!: number | 'auto';
	private _items: ComboItemType;
	private _allowSearch: boolean;
	private _input?: HTMLInputElement;

	private _dividedByCategories: boolean;
	private _categories!: Map<string, Set<ComboItemData>>;
	private _displayItems!: ComboItemData[];

	private _actionTrigger: StateSetter<Nullable<ComboItemData>>;
	private _onChange?: (core: ComboBoxCore) => void;
	private _onBlur?: (core: ComboBoxCore) => void;
	private _inputBlurEvent!: () => void;
	private readonly _inputEventManager: EventManager;

	constructor({
		value,
		items,
		allowSearch,
		actionTrigger,
		inputEventManager,
		itemHeight,
	}: ComboBoxCoreConfig) {
		makeObservable(this);
		this._items = items;
		this._allowSearch = allowSearch ?? false;
		this._value = value;
		this._dividedByCategories = !(items instanceof Array);
		this._actionTrigger = actionTrigger;
		this._inputEventManager = inputEventManager;
		this._itemHeight = itemHeight ?? 40;

		this.search = this.search.bind(this);
		this.resetSearch = this.resetSearch.bind(this);
		this.recalculateComboBoxHeight = this.recalculateComboBoxHeight.bind(this);

		this._setEvents();
		this._resetCategorySets();
		this._resetDisplayItems();
	}

	@action
	public setItemHeight(itemHeight: number) {
		this._itemHeight = itemHeight;
		this.recalculateComboBoxHeight();
	}

	public getItemHeight() {
		return this._itemHeight;
	}

	public setAllowSearch(allowSearch: boolean) {
		this._allowSearch = allowSearch;
	}

	public setActionTrigger(actionTrigger: StateSetter<Nullable<ComboItemData>>) {
		this._actionTrigger = actionTrigger;
	}

	public setInput(input: Nullable<HTMLInputElement>) {
		if (input) {
			this._input = input;
			input.value = this._value?.label ?? '';
		}
	}

	public setValue(value: Nullable<ComboItemData>) {
		this._value = value;
		this.setInput(this._input);
		this._actionTrigger(value);
		this._onChange?.(this);
	}

	public setItems(items: ComboItemType) {
		this._items = items;
		this._dividedByCategories = !(items instanceof Array);
		this._resetCategorySets();
		this._resetDisplayItems();
	}

	public clear() {
		this.setValue(null);
	}

	public recalculateComboBoxHeight() {
		const maxItemsToBeAuto = 5;
		this._height = this._displayItems.length <= maxItemsToBeAuto 
			? 'auto' 
			: maxItemsToBeAuto * this._itemHeight;
	}

	public search() {
		if (!this._allowSearch) return;
		if (!this._input) return;

		const input = this._input;
		this._displayItems = [];

		if (this._items instanceof Array) {
			this._displayItems = this._items.filter(item => item.label.search(input.value) > -1);
		} else if (!(this._items instanceof Array)) {
			this._categories.forEach(set => {
				const items = [...set.values()].filter((item: ComboItemData) => item.label.search(input.value) > -1);
				this._displayItems = this._displayItems.concat(items);
			});
		}

		this.recalculateComboBoxHeight();
	}

	public resetSearch() {
		if (!this._input) {
			return;
		}

		this._input.value = this._value?.label ?? '';
		this._resetDisplayItems();
	}

	public destroy() {
		this._inputEventManager.remove(0, AquinoEvents.BLUR, this._inputBlurEvent);
		this._inputEventManager.remove(0, AquinoEvents.KEYUP, this.search);
	}

	public getValue() {
		return this._value;
	}

	public getHeight() {
		return this._height;
	}

	public getDisplayItems() {
		return this._displayItems;
	}

	public getAllowSearch() {
		return this._allowSearch;
	}

	public getDividedByCategories() {
		return this._dividedByCategories;
	}

	public getCategories() {
		return this._categories;
	}

	public onBlur(callback: (core: ComboBoxCore) => void) {
		this._onBlur = callback;
	}

	public onChange(callback: (core: ComboBoxCore) => void) {
		this._onChange = callback;
	}

  private _setEvents() {
		this._inputBlurEvent = () => {
			this.resetSearch();
			this._onBlur?.(this);
		};

		this._inputEventManager.add(0, AquinoEvents.BLUR, this._inputBlurEvent);
		this._inputEventManager.add(0, AquinoEvents.KEYUP, this.search);
	}

	private _resetDisplayItems() {
		this._displayItems = [];
		if (this._items instanceof Array) {
			this._displayItems = this._displayItems.concat(this._items);
		} else {
			this._categories.forEach(set => {
				this._displayItems = this._displayItems.concat([...set.values()]);
			});
		}

		this.recalculateComboBoxHeight();
	}

	private _resetCategorySets() {
		this._categories = new Map();
		if (this._items instanceof Array) {
			return;
		}

    type CategorizedItems = Record<string, ComboItemData[]>;

    const items = this._items as CategorizedItems;

    Object.keys(items).forEach((key: keyof CategorizedItems) => {
      const category = new Set<ComboItemData>(items[key]);
      this._categories.set(key, category);
    });
	}
}

export default ComboBoxCore;
