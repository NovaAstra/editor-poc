import { _global } from "./global"

export const getElemHeight = (element: Element) =>
  Math.max(element.scrollHeight, element.clientHeight)

export const computeStyle = (element: Element, prop: string) =>
  _global.getComputedStyle(element)[prop]

export const getFontSize = (element: Element) => parseFloat(computeStyle(element, "font-size"))

export const getContentHeight = (element: Element) => {
  const boxSizing = computeStyle(element, 'boxSizing');

  if (boxSizing === 'border-box') {
    const borderTop = parseFloat(computeStyle(element, "borderTopWidth")) || 0;
    const borderBottom = parseFloat(computeStyle(element, "borderBottomWidth")) || 0;
    const paddingTop = parseFloat(computeStyle(element, "paddingTop")) || 0;
    const paddingBottom = parseFloat(computeStyle(element, "paddingBottom")) || 0;
    return element.clientHeight - borderTop - borderBottom - paddingTop - paddingBottom;
  }

  return parseFloat(computeStyle(element, "height")) || element.clientHeight;
}

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

export const getMaxHeight = (element: Element, clamp: number) => {
  return Math.min(getLineHeight(element) * clamp, getContentHeight(element))
}