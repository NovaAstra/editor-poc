import { isWindow } from "./is"

export type TaskCallback = (() => TaskCallback) | null | undefined

export interface Task {
  callback?: TaskCallback
}

const THRESHOLD: number = 5

export const getTime = typeof performance !== "undefined"
  ? () => performance.now()
  : () => Date.now();

export const microtask: (callback: () => void) => void =
  typeof queueMicrotask === "function"
    ? queueMicrotask
    : (callback) => {
      Promise.resolve().then(callback);
    };

export class Schedule {
  private readonly threshold: number = THRESHOLD;
  private transitions: (() => void)[] = []
  private deadline: number = 0;
  private queue: Task[] = [];
  private translate: () => void = this.createTask(false)

  public startTransition(callback: () => void) {
    this.transitions.push(callback) && this.translate()
  }

  public schedule(callback: TaskCallback) {
    this.queue.push({ callback })
    this.startTransition(this.flush.bind(this))
  }

  private async flush() {
    this.deadline = getTime() + this.threshold
    let task = Schedule.peek(this.queue);
    while (task && !this.shouldYield()) {
      const { callback } = task
      task.callback = null
      const next = callback()
      if (next) {
        task.callback = next
      } else {
        this.queue.shift()
      }
      task = Schedule.peek(this.queue)
    }
    task && (this.translate = this.createTask(this.shouldYield())) && this.startTransition(this.flush.bind(this))
  }

  private createTask(pending: boolean) {
    const cb = () => this.transitions.splice(0, 1).forEach((c) => c());
    return !pending
      ? () => microtask(cb)
      : typeof MessageChannel !== "undefined"
        ? () => new MessageChannel().port2.postMessage(null)
        : () => setTimeout(cb);
  }

  private shouldYield() {
    return getTime() >= this.deadline
  }

  public static peek(queue: Task[]): Task | undefined {
    return queue[0]
  }
}