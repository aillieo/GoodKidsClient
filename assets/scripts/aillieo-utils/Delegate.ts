import { LinkedList, type LinkedListNode } from "./collections/LinkedList";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Action<T = any> = (value: T) => void

export class Handle {
    private readonly node: LinkedListNode<unknown>;

    constructor(node: LinkedListNode<unknown>) {
        this.node = node;
    }

    public unlisten(): boolean {
        if (this.node.list == null) {
            return false;
        }

        return (this.node.list as LinkedList<unknown>).remove(this.node);
    }
}

export class Delegate<T> {
    private readonly listeners: LinkedList<Action<T>>;

    constructor() {
        this.listeners = new LinkedList<Action<T>>();
    }

    public add(listener: Action<T>): Handle {
        const node = this.listeners.add(listener);
        return new Handle(node);
    }

    public remove(handle: Handle): boolean {
        return handle.unlisten();
    }

    public removeValue(listener: Action<T>): boolean {
        return this.listeners.removeValue(listener);
    }

    public invoke(arg: T): void {
        this.listeners.forEach(listener => { listener(arg); });
    }

    public safeInvoke(arg: T): void {
        this.listeners.forEach(listener => {
            try {
                listener(arg);
            } catch (error) {
                console.error("Error in property change listener:", error);
            }
        });
    }
}
