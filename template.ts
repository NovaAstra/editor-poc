export abstract class Component {

}

export class Table extends Component {
  protected static readonly ["header.class"]: string = ".el-table__header-wrapper";
  protected static readonly ["body.class"]: string = ".el-table__body-wrapper";
  protected static readonly ["footer.class"]: string = ".el-table__footer-wrapper";

  protected static readonly ["row.class"]: string = ".el-table__row";
  protected static readonly ["row.cell.class"]: string = ".el-table__cell";
}

export class Grid {

}

export class List extends Table {

}

export class Gantt {

}

export class PVTable {

}

export class DimessionTable extends Table {

}

export class Widget {
  protected static readonly ["class"]: string = ".vue-grid-layout .vue-grid-item";

  protected static readonly ["header.class"]: string = ".cardHeader";
  protected static readonly ["body.class"]: string = ".control-section";
  protected static readonly ["footer.class"]: string = ".widget__footer";

  public constructor(public readonly paper: Paper) { }
}

export class Paper {
  protected static readonly ["class"]: string = ".dashboard-page.is-pdf .report-layout-views > div > .view-item";

  public static html() {
    
  }
}

export class Papers {
  public constructor(public readonly root: HTMLElement) { }
}