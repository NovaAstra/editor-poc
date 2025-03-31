export abstract class Component {
  protected abstract ["header.class"]: string;
  protected abstract ["body.class"]: string;
  protected abstract ["footer.class"]: string;

  protected abstract ["row.class"]: string;
  protected abstract ["row.cell.class"]: string;
}

export class Table extends Component {
  protected readonly ["header.class"]: string = ".el-table__header-wrapper";
  protected readonly ["body.class"]: string = ".el-table__body-wrapper";
  protected readonly ["footer.class"]: string = ".el-table__footer-wrapper";

  protected readonly ["row.class"]: string = ".el-table__row";
  protected readonly ["row.cell.class"]: string = ".el-table__cell";
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
  protected readonly ["class"]: string = ".vue-grid-layout .vue-grid-item";

  protected readonly ["header.class"]: string = ".cardHeader";
  protected readonly ["body.class"]: string = ".control-section";
  protected readonly ["footer.class"]: string = ".widget__footer";

  public constructor(public readonly paper: Paper) { }

  public html() {

  }
}

export class Paper {
  protected readonly ["class"]: string = ".dashboard-page.is-pdf .report-layout-views > div > .view-item";
}

export class Papers {

}