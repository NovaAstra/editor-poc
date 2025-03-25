import { _global } from "./global"

export const getElemHeight = (element: Element) =>
  Math.max(element.scrollHeight, element.clientHeight)

export const computeStyle = (element: Element, prop: string) =>
  _global.getComputedStyle(element).getPropertyValue(prop)

export const getFontSize = (element: Element) => parseFloat(computeStyle(element, "font-size"))

export const getStyleHeight = (element: Element) => parseFloat(computeStyle(element, "height"))

export const getLineHeight = (element: Element) => {
  let lh: any = computeStyle(element, "line-height");

  return lh === "normal"
    ? parseFloat(computeStyle(element, "font-size")) * 1.2
    : parseFloat(lh)
}

export const getMaxLines = (element: Element, height?: number) => {
  const availHeight = height || element.clientHeight
  const lineHeight = getLineHeight(element)

  return Math.max(Math.floor(availHeight / lineHeight), 0)
}

export const getMaxHeight = (element: Element, clamp: number) =>
  Math.max(getLineHeight(element) * clamp, getStyleHeight(element), 0)