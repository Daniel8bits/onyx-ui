import EventEmitter from "events";



export interface RowDataType {
  id: string,
  display: Record<string, React.ReactNode>
}

interface RowType<T> extends RowDataType {
  data: T
}

export class UITableDocument<T> extends EventEmitter {

  private readonly _MAX_ROWS: number = 7

  private _data!: T[]
  private _loading: boolean = true;

  private _columns: string[]
  private _rows: Map<unknown, RowType<T>>
  private _selectedRow?: RowType<T>

  private _description: (data: T) => RowDataType

  private _paging: boolean
  private _pageNumber: number
  private _params: Record<string, string | number | undefined>;

  private _onRowSelected?: (selectedRow: T) => void
  private _onRowDoubleClicked?: (selectedRow: T) => void

  private _updateComponent?: () => void

  constructor(params: {
      data?: T[],
      columns: string[],
      description: (data: T) => RowDataType,
      paging?: boolean,
      onRowSelected?: (selectedRow: T) => void,
      onRowDoubleClicked?: (selectedRow: T) => void
  }) {
      super();
      this._data = params.data ? params.data : []
      this._columns = params.columns
      this._description = params.description
      this._paging = params.paging ?? true
      this._onRowSelected = params.onRowSelected
      this._onRowDoubleClicked = params.onRowDoubleClicked
      this._rows = new Map()
      this._params = {};
      this._pageNumber = 1
      this.update()

      this.nextPage = this.nextPage.bind(this);
      this.previousPage = this.previousPage.bind(this);
      this.triggerOnRowSelected = this.triggerOnRowSelected.bind(this);
      this.triggerOnRowDoubleClicked = this.triggerOnRowDoubleClicked.bind(this);

  }

  public update() {
      this._rows.clear()
      this.getPageRows().forEach((rowData, i) => {
          const transformedRowData = this._description(rowData)
          this._rows.set(transformedRowData.id, { data: rowData, ...transformedRowData })
      })
      this._updateComponent?.()
  }

  public get loading() {
      return this._loading;
  }

  private getPageRows(): T[] {
      return this._data.slice(this._MAX_ROWS * (this._pageNumber - 1), this._MAX_ROWS * this._pageNumber)
  }

  public getData() {
      return this._data
  }

  public setData(data: T[] | false) {
      this._data = data === false ? [] : data;
      this._loading = false;
      this.update();
  }

  public setParams(params: Record<string, string | number | undefined>) {
      const data : Record<string, string | number | undefined> = {};
      Object.entries(params).forEach(([k,v]) => {
          if(String(v).length > 0) data[k] = v;
      });
      this._params = data;
      this.emit("params", this._params);
  }

  public getParams() : Record<string, string | number | undefined>{
      return this._params;
  }

  public getPageNumber(): number {
      return this._pageNumber
  }

  public setPageNumber(pageNumber: number) {
      if (this.getMaxPage() < pageNumber || pageNumber < 1) {
          return;
      }
      this.pageNumber = pageNumber
      this.update()
  }

  private set pageNumber(value: number) {
      this._pageNumber = value;
      this.emit("page", value)
  }

  public getMaxPage(): number {
      const maxPage = Math.ceil(this._data.length / this._MAX_ROWS)
      if (maxPage === 0) return 1;
      return maxPage;
  }

  public nextPage() {
      const nextPage = this._pageNumber + 1
      const maxPage = this.getMaxPage()
      if (nextPage < maxPage) {
          this.setPageNumber(nextPage)
      }
  }

  public previousPage() {
      const previousPage = this._pageNumber - 1
      if (previousPage > 0) {
          this.setPageNumber(previousPage)
      }
  }

  public setPage(page: number) {
      this.setPageNumber(page);
  }

  public rowMapping(fn: (row: RowType<T>) => JSX.Element): JSX.Element[] {
      return [...this._rows].map(pair => fn(pair[1]))
  }

  public cellMapping(row: RowType<T>, fn: (cell: React.ReactNode, key: string) => React.ReactNode): React.ReactNode {
      const cellKeys = Object.keys(row.display)
      return this._columns.map((value, i) => fn(row.display[cellKeys[i]], cellKeys[i]))
  }

  public columnMapping(fn: (name: string, key: number) => JSX.Element) {
      return this._columns.map((value, i) => fn(value, i))
  }

  public getColumnsLength() {
      return this._columns.length
  }

  public getRowsLength() {
      return this._rows.size
  }

  public triggerOnRowSelected(selectedRow: RowType<T>) {
      this._selectedRow = this._selectedRow === selectedRow ? undefined : selectedRow;
      this._updateComponent?.()
      this._onRowSelected?.(selectedRow.data)
  }

  public triggerOnRowDoubleClicked(dbClickedRow: RowType<T>) {
      this.triggerOnRowSelected(dbClickedRow)
      this._onRowDoubleClicked?.(dbClickedRow.data)
  }

  public setComponentUpdaterTrigger(updateComponent: () => void) {
      this._updateComponent = updateComponent
  }

  public isSelected(row: RowType<T>) {
      return row.id === this._selectedRow?.id
  }

  public getSelectedRow() {
      return this._selectedRow
  }

}

export default UITableDocument