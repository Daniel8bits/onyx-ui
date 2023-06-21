import EventEmitter from 'events';
import type TableDocument from './TableDocument';
import {makeObservable, observable, action} from 'mobx';

export interface RowDataType {
  id: string;
  display: Record<string, React.ReactNode>;
}

export interface RowType<T> extends RowDataType {
  data: T;
}

class TableCore {
  @observable
  private _page: number;

  @observable
  private _selectedRow?: RowType<unknown>;
  
  @observable
  private readonly _rows: Map<unknown, RowType<unknown>>;

  @observable
  private _rowsAsArray: Array<RowType<unknown>>;

  private readonly _document: TableDocument<unknown>;

  private _updateComponent?: () => void;

  constructor(document: TableDocument<unknown>) {
    makeObservable(this);
    this._document = document;
    this._rows = new Map();
    this._rowsAsArray = [];
    this._page = 1;

    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
    
    this.update();

    this.triggerOnRowSelected = this.triggerOnRowSelected.bind(this);
    this.triggerOnRowDoubleClicked = this.triggerOnRowDoubleClicked.bind(this);
  }

  @action
  public nextPage() {
    const nextPage = this._page + 1;
    const maxPage = this.getMaxPage();
    if (nextPage < maxPage + 1) {
        this.setPage(nextPage);
    }
  }

  @action
  public previousPage() {
    const previousPage = this._page - 1;
    if (previousPage > 0) {
        this.setPage(previousPage);
    }
  }

  @action
  public setPage(pageNumber: number) {
    if (this.getMaxPage() < pageNumber || pageNumber < 1) {
      return;
    }

    this.pageNumber(pageNumber);
    this.update();
  }

  public update() {
    this._rows.clear();
    this._rowsAsArray = [];
    this._slicePageRows().forEach((rowData, i) => {
        const transformedRowData = this._document.getDescription()(rowData);
        const data = {data: rowData, ...transformedRowData};
        this._rows.set(transformedRowData.id, data);
        this._rowsAsArray.push(data);
    });
    // . this._updateComponent?.();
  }

  public rowMapping(fn: (row: RowType<unknown>) => JSX.Element): JSX.Element[] {
    return this._rowsAsArray.map(fn);
  }

  public cellMapping(row: RowType<unknown>, fn: (cell: React.ReactNode, key: string) => React.ReactNode): React.ReactNode {
    const cellKeys = Object.keys(row.display);
    return this._document.getColumns().map((value, i) => fn(row.display[cellKeys[i]], cellKeys[i]));
  }

  public columnMapping(fn: (name: string, key: number) => JSX.Element) {
    return this._document.getColumns().map((value, i) => fn(value, i));
  }

  public getPage(): number {
    return this._page;
  }

  public getMaxPage(): number {
    const maxPage = Math.ceil(this._document.getData().length / this._document.getMaxRows());
    if (maxPage === 0) return 1;
    return maxPage;
  }

  public setComponentUpdaterTrigger(updateComponent: () => void) {
    this._updateComponent = updateComponent;
  }

  public triggerOnRowSelected(selectedRow: RowType<unknown>) {
    this._selectedRow = this._selectedRow === selectedRow ? undefined : selectedRow;
    this._updateComponent?.();
    this._document.getOnRowSelected()?.(selectedRow.data);
  }

  public triggerOnRowDoubleClicked(dbClickedRow: RowType<unknown>) {
    this.triggerOnRowSelected(dbClickedRow);
    this._document.getOnRowDoubleClicked()?.(dbClickedRow.data);
  }

  public isSelected(row: RowType<unknown>) {
    return row.id === this._selectedRow?.id;
  }

  public getSelectedRow() {
    return this._selectedRow;
  }

  public getRowsLength() {
    return this._rows.size;
  }

  public getPageRows() {
    return this._rowsAsArray;
  }

  private _slicePageRows(): unknown[] {
    const maxRows = this._document.getMaxRows();
    if (maxRows > 0) return this._document.getData().slice(maxRows * (this._page - 1), maxRows * this._page);
    return this._document.getData();
  }

  private pageNumber(value: number) {
    this._page = value;
  }
}

export default TableCore;
