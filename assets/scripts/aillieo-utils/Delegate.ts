import { Action1 } from "./Action";
import { LinkedList, LinkedListNode } from "./LinkedList";

export class Handle {
    private node : LinkedListNode<unknown>;

    constructor(node: LinkedListNode<unknown>) {
        this.node = node;
    }

    public unlisten() : boolean {
        if (this.node.list == null) {
            return false;
        }

        return (this.node.list as LinkedList<unknown>).remove(this.node);
    }
}

export class Delegate<T> {
    private listeners: LinkedList<Action1<T>>;

    constructor() {
        this.listeners = new LinkedList<Action1<T>>();
    }

    public add(listener: Action1<T>): Handle {
        const node = this.listeners.add(listener);
        return new Handle(node);
    }

    public remove(handle: Handle): boolean {
        return handle.unlisten();
    }

    public removeValue(listener: Action1<T>): boolean {
        return this.listeners.removeValue(listener);
    }

    public invoke(arg: T): void {
        this.listeners.forEach(listener => listener(arg));
    }

    public safeInvoke(arg: T) : void {
        this.listeners.forEach(listener => {
            try {
                listener(arg);
            }
            catch (error) {
                console.error("Error in property change listener:", error);
            }
        });
    }
}
