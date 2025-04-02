export class Table {
  protected static readonly ["header.class"]: string = ".el-table__header-wrapper";
  protected static readonly ["body.class"]: string = ".el-table__body-wrapper";
  protected static readonly ["footer.class"]: string = ".el-table__footer-wrapper";

  protected static readonly ["row.class"]: string = ".el-table__row";
  protected static readonly ["row.cell.class"]: string = ".el-table__cell";
}


export class Widget {
  public static readonly ["class"]: string = ".vue-grid-layout .vue-grid-item";

  protected static readonly ["header.class"]: string = ".cardHeader";
  protected static readonly ["body.class"]: string = ".control-section";
  protected static readonly ["footer.class"]: string = ".widget__footer";

  protected static readonly ["template.class"]: string = '.gridnew_gadget_tempalte'

  public constructor(public readonly paper: Paper, public readonly element: HTMLElement) { }

  public html() {

  }
}

export class Paper {
  protected static readonly ["class"]: string = ".dashboard-page.is-pdf .report-layout-views > div > .view-item";

  public readonly widgets: Widget[] = [];

  public constructor(public readonly element: HTMLElement) { }

  public compose() {
    const elements = this.element.querySelectorAll(Paper["class"])
    elements.forEach(element => {
      this.widgets.push(new Widget(this, element as HTMLElement));
    });
  }
}

export class Papers {
  public readonly papers: Paper[] = [];

  public constructor(public readonly root: HTMLElement) {
    this.compose()
  }

  public compose() {
    const elements = this.root.querySelectorAll(Paper["class"])
    elements.forEach(element => {
      this.papers.push(new Paper(element as HTMLElement));
    });
  }
}

export class Render {
  public readonly root: HTMLElement
  private readonly papers: Papers;

  public constructor(root: HTMLElement) {
    if (!root)
      throw new Error('There is no content to print. Please check the current page of the report.')

    this.root = root;
    this.papers = new Papers(root)
  }

  public compose() { }

  public analysis() { }

  public create() { }
}

export const draw = async (root: HTMLElement) => {
  const render = new Render(root)

  await render.compose()

  await render.create()

  await render.analysis()

  return true;
}