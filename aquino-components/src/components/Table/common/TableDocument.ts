import type {RowType, RowDataType} from './TableCore';
import type TableCore from './TableCore';

class TableDocument<T> {
  private _data!: T[];
  private _loading: boolean;
  private _maxRows: number;

  private readonly _columns: string[];
  private readonly _description: (data: T) => RowDataType;

  private _params: Record<string, string | number | undefined>;

  private readonly _onRowSelected?: (selectedRow: T) => void;
  private readonly _onRowDoubleClicked?: (selectedRow: T) => void;

  private _core: Nullable<TableCore>;

  constructor(params: {
    data?: T[];
    columns: string[];
    description: (data: T) => RowDataType;
    maxRows?: number;
    onRowSelected?: (selectedRow: T) => void;
    onRowDoubleClicked?: (selectedRow: T) => void;
  }) {
    this._data = params.data ?? [];
    this._columns = params.columns;
    this._description = params.description;
    this._maxRows = params.maxRows ?? 0;
    this._onRowSelected = params.onRowSelected;
    this._onRowDoubleClicked = params.onRowDoubleClicked;
    this._params = {};
    this._loading = false;
  }

  public setCore(core: TableCore) {
    this._core = core;
  }

  public setMaxRows(maxRows: number) {
    this._maxRows = maxRows;
  }

  public getMaxRows() {
    return this._maxRows;
  }

  public getLoading() {
    return this._loading;
  }

  public getData() {
    return this._data;
  }

  public setData(data: T[] | false) {
    this._data = data === false ? [] : data;
    this._loading = false;
    this._core?.update();
  }

  public setParams(params: Record<string, string | number | undefined>) {
    const data: Record<string, string | number | undefined> = {};
    Object.entries(params).forEach(([k, v]) => {
      if (String(v).length > 0) data[k] = v;
    });
    this._params = data;
    // . this._core?.emit('params', this._params);
  }

  public getParams(): Record<string, string | number | undefined> {
    return this._params;
  }

  public getColumnsLength() {
    return this._columns.length;
  }

  public getColumns() {
    return this._columns;
  }

  public getDescription() {
    return this._description;
  }

  public getOnRowSelected() {
    return this._onRowSelected;
  }

  public getOnRowDoubleClicked() {
    return this._onRowDoubleClicked;
  }

  public isPaged() {
    return this._maxRows > 0;
  }
}

export default TableDocument;
