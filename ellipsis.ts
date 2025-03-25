import { getMaxLines, getMaxHeight, getElemHeight } from "./element"

export type Px = `${number}px`
export type Line = number

export interface Options {
  clamp: 'auto' | Line | Px;
}

const DEFAULT_OPTIONS: Partial<Options> = {
  clamp: 'auto'
}

export class EllipsisOptions implements Options {
  public clamp: 'auto' | Line | Px;

  public constructor(
    public readonly root: Element,
    options: Partial<Options> = {}
  ) {
    Object.assign(this, DEFAULT_OPTIONS, options)
  }
}

export class EllipsisResponse {
  public constructor(
    public readonly truncated: boolean = false,
    public readonly fullhtml?: string,
    public readonly cutedhtml?: string,
    public readonly remainhtml?: string
  ) { }
}

export class Ellipsis {
  public static ellipsis(root: Element, options: Partial<Options> = {}) {
    return new Ellipsis(root, options)
  }

  public static getClampValue(element: Element, clamp: 'auto' | Line | Px) {
    if (typeof clamp === 'number') return clamp;

    const isCSSValue = clamp.indexOf && clamp.indexOf("px") > -1;
    if (isCSSValue) return getMaxLines(element, parseFloat(clamp))

    return getMaxLines(element)
  }

  private readonly range: Range = document.createRange();

  private readonly options: EllipsisOptions

  private get outerhtml() {
    return this.root.outerHTML
  }

  public constructor(
    public readonly root: Element,
    options: Partial<Options> = {}
  ) {
    if (!this.root) {
      console.warn("Initialize without mounting the root container.")
    }

    this.options = new EllipsisOptions(root, options)
  }

  public html() {
    if (!this.root) return new EllipsisResponse(false);

    if (!this.root.hasChildNodes()) return new EllipsisResponse(false);

    let clampValue = Ellipsis.getClampValue(this.root, this.options.clamp)
    const height = getMaxHeight(this.root, clampValue)
    if (getElemHeight(this.root) <= height) return new EllipsisResponse(false)

    this.range.setStart(this.root, 0);

    const truncated = this.node(this.root, height);

    return new EllipsisResponse(truncated, this.outerhtml);
  }

  public node(element: Element, height: number): boolean {
    const nodes = element.childNodes

    let low = 0;
    let high = nodes.length;

    while (low < high) {
      let middle = Math.floor((low + high) / 2);

      this.range.setEnd(this.root, middle)

      if (this.range.getBoundingClientRect().height <= height) {
        low = middle + 1;
      } else {
        high = middle
      }
    }

    const fragment = this.range.cloneContents();
    console.log(fragment); // 获取范围内的所有节点
    console.log(high, nodes)

    return false
  }

  public text() { }
}

export const ellipsis = (root: Element) => Ellipsis.ellipsis(root)