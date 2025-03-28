import { getMaxLines, getMaxHeight, getElemHeight, getMaxContentBottom } from "./element"
import { _global } from "./global"

export type Px = `${number}px`
export type Line = number

export type ArrayLike<T> = {
  length: number;
  [n: number]: T;
}

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

    const isCSSValue = typeof clamp === 'string' && clamp.indexOf("px") > -1;
    if (isCSSValue) return getMaxLines(element, parseFloat(clamp))

    return getMaxLines(element)
  }

  private readonly range: Range = document.createRange();
  private readonly options: EllipsisOptions
  private estimatedAvailableHeight: number = 0

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

    const bottom = getMaxContentBottom(this.root)
    this.truncated(this.root, bottom);

    return new EllipsisResponse(false, this.root.outerHTML);
  }

  private truncated(element: Element, bottom: number) {
    if (!element || element.nodeType === Node.COMMENT_NODE) return false;

    switch (element.nodeType) {
      case Node.TEXT_NODE:
        return this.text(element as unknown as Text, bottom)
      case Node.ELEMENT_NODE:
        return this.node(element, bottom)
      default:
        return false
    }
  }

  protected node(element: Element, bottom: number): boolean {
    const nodes = element.childNodes;

    const position = this.move(nodes, bottom, element);
    if (position >= 0) {
      const lastNode = nodes[position] as Element;
      return this.truncated(lastNode, bottom);
    }

    const lastNode = element.previousSibling as Element;
    return this.truncated(lastNode, bottom);

  }

  protected text(node: Text, bottom: number) {
    const text = node.nodeValue || '';

    let position = this.move(text, bottom, node);

    if (position >= 0) {
      this.range.setEnd(node, position);
    } else {
      const previousSibling = node.parentNode?.previousSibling;
      if (previousSibling) {
        this.range.setEndAfter(previousSibling);
      }
    }

    document.getElementById('ellipsis').appendChild(this.range.cloneContents())
    return position >= 0
  }

  private move<T>(elements: ArrayLike<T>, bottom: number, node: Node, deviation: number = 0.03) {
    this.range.setEndAfter(node)

    const b = this.range.getBoundingClientRect().bottom
    if (b <= bottom - deviation)
      return elements.length - 1;

    if (elements.length === 0)
      return b > bottom - deviation ? -1 : 0;

    let low = 0;
    let high = elements.length - 1;

    while (low <= high) {
      let middle = low + ((high - low) >> 1);

      this.range.setEnd(node, middle)
      if (this.range.getBoundingClientRect().bottom <= bottom - deviation) {
        low = middle + 1;
      } else {
        high = middle - 1
      }
    }

    return high;
  }
}

export const ellipsis = (root: Element) => Ellipsis.ellipsis(root)
