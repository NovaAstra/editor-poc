export type TaskCallback = (() => TaskCallback) | null | undefined

export interface Task {
  callback?: TaskCallback
}

const THRESHOLD: number = 5

export const getTime = typeof performance !== "undefined"
  ? () => performance.now()
  : () => Date.now();

export const peek = (queue: Task[]): Task | undefined => {
  return queue[0]
}

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
    let task = peek(this.queue);
    while (task && !this.shouldYield()) {
      const { callback } = task
      task.callback = null
      const next = callback()
      if (next) {
        task.callback = next
      } else {
        this.queue.shift()
      }
      task = peek(this.queue)
    }
    task && (this.translate = this.createTask(this.shouldYield())) && this.startTransition(this.flush.bind(this))
  }

  private createTask(pending: boolean) {
    const callback = () => this.transitions.shift()?.();

    if (!pending)
      return () => microtask(callback);

    if (typeof MessageChannel !== "undefined") {
      const { port1, port2 } = new MessageChannel();
      port1.onmessage = callback;
      return () => port2.postMessage(null);
    }

    return () => setTimeout(callback, 0);
  }

  private shouldYield() {
    return getTime() >= this.deadline
  }
}