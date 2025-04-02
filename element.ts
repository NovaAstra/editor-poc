import { _global } from "./global"

const DEFAULT_LINE_HEIGHT_MULTIPLIER = 1.2;

export interface ElementRect extends DOMRect {
  $el: HTMLElement;
  offset: number;
}

export const getElemHeight = (element: HTMLElement) =>
  Math.max(element.scrollHeight, element.clientHeight)

export const computeStyle = (element: HTMLElement, prop: keyof CSSStyleDeclaration) =>
  _global.getComputedStyle(element)[prop] as string

export const getFontSize = (element: HTMLElement) => numericStyle(element, "fontSize")

export const numeric = (input: unknown) => parseFloat(input as string) || 0

export const numericStyle = (element: HTMLElement, prop: keyof CSSStyleDeclaration): number =>
  numeric(computeStyle(element, prop))

export const getContentHeight = (element: HTMLElement) => {
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

export const getLineHeight = (element: HTMLElement) => {
  const computedStyle = _global.getComputedStyle(element)
  let lh: string = computedStyle["lineHeight"];

  return lh === "normal"
    ? numeric(computedStyle["fontSize"]) * DEFAULT_LINE_HEIGHT_MULTIPLIER
    : numeric(lh)
}

export const getMaxLines = (element: HTMLElement, height?: number) => {
  const availHeight = height || element.clientHeight
  const lineHeight = getLineHeight(element)

  return Math.max(Math.floor(availHeight / lineHeight), 0)
}

export const getMaxHeight = (element: HTMLElement, clamp: number) =>
  Math.min(getLineHeight(element) * clamp, getContentHeight(element))

export const getFullHeight = (element: HTMLElement) => {
  const computedStyle = _global.getComputedStyle(element);

  return element.offsetHeight
    + numeric(computedStyle['marginTop'])
    + numeric(computedStyle['marginBottom'])
}

export const getMaxContentBottom = (element: HTMLElement) => {
  const { bottom } = element.getBoundingClientRect()
  const computedStyle = _global.getComputedStyle(element)
  return bottom
    - numeric(computedStyle['borderBottomWidth'])
    - numeric(computedStyle['paddingBottom'])
}

export const hasFixedHeight = (element: HTMLElement) => {
  const clone = element.cloneNode() as HTMLElement
  clone.innerHTML = ''
  clone.style.position = 'absolute';
  clone.style.visibility = 'hidden';
  clone.style.zIndex = "-99999";

  document.body.appendChild(clone);

  const height = getFullHeight(clone)
  document.body.removeChild(clone)
  return height !== 0
}

export const getElemRect = (element: HTMLElement) => {
  if (element) {
    let rect = element.getBoundingClientRect() as ElementRect
    rect.$el = element
    rect.offset = 0
    return rect
  }
}