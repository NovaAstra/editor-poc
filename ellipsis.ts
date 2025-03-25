export interface EllipsisOptions { }

export interface HtmlEllipsisOptions extends EllipsisOptions { }

export interface TextEllipsisOptions extends EllipsisOptions { }

export class Ellipsis {
  public static ellipsis(root: Element) {
    return new Ellipsis(root)
  }

  private range: Range = document.createRange();

  public constructor(
    public readonly root: Element,
    public options: EllipsisOptions = {}
  ) {
    if (!this.root) {
      console.warn("Initialize without mounting the root container.")
    }
  }

  public html(options: HtmlEllipsisOptions) { }

  public text(options: TextEllipsisOptions) { }
}

export const ellipsis = (root: Element) => Ellipsis.ellipsis(root)