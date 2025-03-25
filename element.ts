import { _global } from "./global"

export const getElemHeight = (element: Element) =>
  Math.max(element.scrollHeight, element.clientHeight) - 4

export const computeStyle = (element: Element, prop: string) =>
  _global.getComputedStyle(element).getPropertyValue(prop)

export const getLineHeight = (element: Element): number => {
  let lh: any = computeStyle(element, "line-height");

  if (lh === "normal") {
    lh = parseFloat(computeStyle(element, "font-size")) * 1.1;
  }else{
    lh = parseFloat(lh)
  }

  return lh as number
}