import { _global } from "./global"

const DEFAULT_LINE_HEIGHT_MULTIPLIER = 1.2;

export const getElemHeight = (element: Element) =>
  Math.max(element.scrollHeight, element.clientHeight)

export const computeStyle = (element: Element, prop: keyof CSSStyleDeclaration) =>
  _global.getComputedStyle(element)[prop] as string

export const getFontSize = (element: Element) => numericStyle(element, "fontSize")

export const numeric = (input: unknown) => parseFloat(input as string) || 0

export const numericStyle = (element: Element, prop: keyof CSSStyleDeclaration): number =>
  numeric(computeStyle(element, prop))

export const getContentHeight = (element: Element) => {
  const computedStyle = _global.getComputedStyle(element)
  const boxSizing = computedStyle["boxSizing"];

  if (boxSizing === 'border-box') {
    return element.clientHeight
      - numeric(computedStyle['borderTopWidth'])
      - numeric(computedStyle['borderBottomWidth'])
      - numeric(computedStyle['paddingTop'])
      - numeric(computedStyle['paddingBottom']);
  }

  return numeric(computedStyle['height']) || element.clientHeight;
}

export const getLineHeight = (element: Element) => {
  const computedStyle = _global.getComputedStyle(element)
  let lh: string = computedStyle["lineHeight"];

  return lh === "normal"
    ? numeric(computedStyle["fontSize"]) * DEFAULT_LINE_HEIGHT_MULTIPLIER
    : numeric(lh)
}

export const getMaxLines = (element: Element, height?: number) => {
  const availHeight = height || element.clientHeight
  const lineHeight = getLineHeight(element)

  return Math.max(Math.floor(availHeight / lineHeight), 0)
}

export const getMaxHeight = (element: Element, clamp: number) =>
  Math.min(getLineHeight(element) * clamp, getContentHeight(element))

export const getMaxContentBottom = (element: Element) => {
  const { bottom } = element.getBoundingClientRect()
  const computedStyle = _global.getComputedStyle(element)
  return bottom
    - numeric(computedStyle['borderBottomWidth'])
    - numeric(computedStyle['paddingBottom'])
}