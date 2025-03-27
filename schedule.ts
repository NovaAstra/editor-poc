export type TaskCallback = (() => TaskCallback) | null | undefined

export interface Task {
  callback?: TaskCallback
}

const THRESHOLD: number = 5

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

export class Stack<T> {
  private heap: T[] = [];

  public peek(): T | undefined {
    return this.heap[0];
  }

  public push() { }

  public pop() { }

  public size(): number {
    return this.length()
  }

  private length(): number {
    return this.heap.length;
  }
}

export class Queue<T> extends Stack<T> {
  public constructor() {
    super()
  }
}


export class Schedule<T = unknown> {
  private readonly threshold: number = THRESHOLD;
  private deadline: number = 0;
  private queue: Queue<T> = new Queue<T>()

  public constructor() { }

  public tryRun() { }

  public async flush() {
    this.deadline = Schedule.getTime() + this.threshold
    let task = this.queue.peek()
  }

  public static getTime: () => number;

  private shouldYield() {
    return Schedule.getTime() >= this.deadline
  }
}

Schedule.getTime = getTime