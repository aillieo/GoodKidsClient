class LinkedListNode<T> {
    public value: T;
    // eslint-disable-next-line no-use-before-define
    public prev: LinkedListNode<T> | null = null;
    // eslint-disable-next-line no-use-before-define
    public next: LinkedListNode<T> | null = null;
    public list: unknown;

    constructor(value: T) {
        this.value = value;
    }
}

class LinkedList<T> {
    private head: LinkedListNode<T> | null = null;
    private tail: LinkedListNode<T> | null = null;

    public count(): number {
        return 0;
    }

    public add(value: T): LinkedListNode<T> {
        const newNode = new LinkedListNode<T>(value);

        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.prev = this.tail;
      this.tail!.next = newNode;
      this.tail = newNode;
        }

        return newNode;
    }

    public remove(node: LinkedListNode<T>): boolean {
        if (node.list !== this) {
            return false;
        }

        if (node.prev) {
            node.prev.next = node.next;
        } else {
            this.head = node.next;
        }

        if (node.next) {
            node.next.prev = node.prev;
        } else {
            this.tail = node.prev;
        }

        return true;
    }

    public removeValue(value: T): boolean {
        let current = this.head;
        while (current) {
            if (current.value === value) {
                this.remove(current);
                return true;
            }

            current = current.next;
        }
        return false;
    }

    public forEach(callback: (value: T) => void): void {
        let current = this.head;
        while (current) {
            callback(current.value);
            current = current.next;
        }
    }
}

export { LinkedList, LinkedListNode };
