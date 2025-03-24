export type TaskCallback = (() => TaskCallback) | null | undefined

export interface Task {
  callback?: TaskCallback
}

const threshold: number = 5

export const isBrowser = typeof window !== "undefined";

export const getTime = typeof performance !== "undefined"
  ? () => performance.now()
  : () => Date.now();

export const microtask: (fn: () => void) => void =
  typeof queueMicrotask === "function"
    ? queueMicrotask
    : (fn) => {
      Promise.resolve().then(fn);
    };

export class Schedule {
  private threshold: number = threshold;
  private deadline: number = 0;
  protected queue: Task[] = []
}