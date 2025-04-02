import { type ElementRect, getElemRect } from "./element"
import { type TaskCallback, Schedule } from "./schedule"

export enum ComponentTypeEnum {
  COMMON = 'common',
  TABLE = 'table',
  LIST = 'list',
  GRID = 'grid',
  GANTT = 'gantt',
  TTABLE = 'ttable'
}

export const scheduler = new Schedule()

export const doubleEnded = <T>(
  elements: ArrayLike<T>,
  scheduler: Schedule,
  callback: (item: T, index: number) => void,
  batchSize: number = 10
) => {
  let start = 0;
  let end = elements.length - 1;

  return new Promise<void>((resolve) => {
    const process = (): TaskCallback => {
      let processed = 0;
      while (start <= end && processed < batchSize) {
        callback(elements[start], start);
        start++;
        processed++;

        if (start <= end && processed < batchSize) {
          callback(elements[end], end);
          end--;
          processed++;
        }
      }

      if (start <= end) {
        return process;
      }

      resolve()
    };

    scheduler.schedule(process);
  });
}

export const getComponentType = (element: HTMLElement): ComponentTypeEnum => {
  const template = element.querySelector(Widget["template.class"]) as HTMLElement
  if (!template) return ComponentTypeEnum.COMMON

  const style = template.dataset.style;

  switch (style) {
    case "Table":
      return ComponentTypeEnum.TABLE
    case 'List':
      return ComponentTypeEnum.LIST
    case 'Data Grid':
      return ComponentTypeEnum.GRID
    case 'Gantt':
      return ComponentTypeEnum.GANTT
    case 'Two Table Dimensions':
      return ComponentTypeEnum.TTABLE
    default:
      return ComponentTypeEnum.COMMON
  }
}

export abstract class Component {
  public constructor(public readonly widget: Widget, public readonly $el: HTMLElement) { }

  public abstract compose(): void;
}

export class Common extends Component {
  public readonly type: ComponentTypeEnum = ComponentTypeEnum.COMMON;

  public async compose() { }
}

export class Grid extends Component {
  public readonly type: ComponentTypeEnum = ComponentTypeEnum.TABLE;

  public static readonly ["class"]: string = ".e-grid";

  protected static readonly ["header.class"]: string = ".e-gridheader";
  protected static readonly ["body.class"]: string = ".e-gridcontent";
  protected static readonly ["footer.class"]: string = ".e-gridfooter";

  protected static readonly ["row.class"]: string = ".e-content .e-table tbody .e-row";
  protected static readonly ["row.cell.class"]: string = ".e-rowcell";

  public table: ElementRect;

  public $header: ElementRect;
  public $body: ElementRect;
  public $footer: ElementRect;

  public $rows: ElementRect[] = []

  public constructor(public readonly widget: Widget, $el: HTMLElement) {
    super(widget, $el)
  }

  public async compose() {
    this.table = getElemRect(this.$el.querySelector(Grid["class"]))

    this.$header = getElemRect(this.table.$el.querySelector(Grid["header.class"]))
    this.$body = getElemRect(this.table.$el.querySelector(Grid["body.class"]))
    this.$footer = getElemRect(this.table.$el.querySelector(Grid["footer.class"]))

    await this.getRows()
  }

  private async getRows() {
    const elements = this.$body.$el.querySelectorAll(Grid["row.class"])
    await doubleEnded(
      elements,
      scheduler,
      (element, index) => {
        this.$rows[index] = getElemRect(element as HTMLElement);
      }
    );
  }
}

export class Table extends Component {
  public readonly type: ComponentTypeEnum = ComponentTypeEnum.TABLE;

  public static readonly ["class"]: string = ".el-table";

  protected static readonly ["header.class"]: string = ".el-table__header-wrapper";
  protected static readonly ["body.class"]: string = ".el-table__body-wrapper";
  protected static readonly ["footer.class"]: string = ".el-table__footer-wrapper";

  protected static readonly ["row.class"]: string = ".el-table__row";
  protected static readonly ["row.cell.class"]: string = ".el-table__cell";

  public rect: ElementRect;

  public $header: ElementRect;
  public $body: ElementRect;
  public $footer: ElementRect;

  public $rows: ElementRect[] = []

  public constructor(public readonly widget: Widget, $el: HTMLElement) {
    super(widget, $el)
  }

  public async compose() {
    this.rect = getElemRect(this.$el.querySelector(Table["class"]))

    this.$header = getElemRect(this.rect.$el.querySelector(Table["header.class"]))
    this.$body = getElemRect(this.rect.$el.querySelector(Table["body.class"]))
    this.$footer = getElemRect(this.rect.$el.querySelector(Table["footer.class"]))

    await this.getRows()
  }

  private async getRows() {
    const elements = this.$body.$el.querySelectorAll(Table["row.class"])
    await doubleEnded(
      elements,
      scheduler,
      (element, index) => {
        this.$rows[index] = getElemRect(element as HTMLElement);
      }
    );
  }
}

export class List extends Table {
  public readonly type: ComponentTypeEnum = ComponentTypeEnum.LIST;
}

export class Widget {
  public static readonly ["class"]: string = ".vue-grid-layout .vue-grid-item:not(.vue-grid-placeholder)";

  protected static readonly ["header.class"]: string = ".cardHeader";
  protected static readonly ["body.class"]: string = ".control-section";
  protected static readonly ["footer.class"]: string = ".widget__footer";

  protected static readonly ["template.class"]: string = '.gridnew_gadget_tempalte'

  private static readonly COMPONENT_MAP = new Map<ComponentTypeEnum, new (widget: Widget, element: HTMLElement) => Component>([
    [ComponentTypeEnum.COMMON, Common],
    [ComponentTypeEnum.TABLE, Table],
    [ComponentTypeEnum.LIST, List],
    [ComponentTypeEnum.GRID, Grid],
    [ComponentTypeEnum.GANTT, Table],
    [ComponentTypeEnum.TTABLE, Table]
  ]);

  public readonly rect: ElementRect

  public component: Component

  public constructor(public readonly paper: Paper, public readonly $el: HTMLElement) {
    this.rect = getElemRect($el)
  }

  public async compose() {
    const component = getComponentType(this.$el)
    const ComponentClass = Widget.COMPONENT_MAP.get(component) || Common;
    this.component = new ComponentClass(this, this.$el);
    await this.component.compose()
  }
}

export class Paper {
  protected static readonly ["class"]: string = ".dashboard-page.is-pdf .report-layout-views > div > .view-item";

  public widgets: Widget[] = [];

  public readonly rect: ElementRect;

  public readonly offset: number = 0;

  public constructor(public readonly $el: HTMLElement) {
    this.rect = getElemRect($el)
    this.offset = this.rect.y || 0
  }

  public async compose() {
    const elements = this.$el.querySelectorAll(Widget["class"])
    const iterator = elements[Symbol.iterator]();
    let element;
    let widgets: Widget[] = []
    while (element = iterator.next().value) {
      const widget = new Widget(this, element as HTMLElement);
      await widget.compose();
      widgets.push(widget);
    }

    this.widgets = widgets.sort((n1, n2) => {
      if (n1.rect.y !== n2.rect.y) return n1.rect.y - n2.rect.y
      return n1.rect.x - n2.rect.x
    })
  }
}

export class Render {
  public readonly papers: Paper[] = [];

  public constructor(public readonly root: HTMLElement) {
    if (!root)
      throw new Error('There is no content to print. Please check the current page of the report.')
  }

  public async compose() {
    const elements = this.root.querySelectorAll(Paper["class"])
    const iterator = elements[Symbol.iterator]();
    let element;
    while (element = iterator.next().value) {
      const paper = new Paper(element as HTMLElement);
      await paper.compose();
      this.papers.push(paper);
    }

    console.log(this)
  }

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