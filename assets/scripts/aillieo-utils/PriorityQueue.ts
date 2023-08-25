type Comparer<T> = (x: T, y: T) => boolean;

class PriorityQueue<T> {
    private data: T[];
    private comparer: Comparer<T>;

    constructor(comparer?: Comparer<T>) {
        this.data = [];
        this.comparer = comparer || ((x: T, y: T) => x < y);
    }

    public clear(): void {
        this.data = [];
    }

    public pop(): T | undefined {
        const node = this.data[0];
        if (node) {
            const count = this.data.length;
            this.data[0] = this.data[count - 1];
            this.data.pop();
            if (this.count() > 0) {
                this.siftDown(0);
            }
            return node;
        }
        return undefined;
    }

    public top(): T | undefined {
        return this.data[0];
    }

    public push(value: T): void {
        this.data.push(value);
        this.siftUp(this.data.length - 1);
    }

    public count(): number {
        return this.data.length;
    }

    private siftUp(index: number): void {
        const parent = Math.floor((index - 1) / 2);
        if (parent >= 0 && this.comparer(this.data[index], this.data[parent])) {
            [this.data[parent], this.data[index]] = [this.data[index], this.data[parent]];
            this.siftUp(parent);
        }
    }

    private siftDown(index: number): void {
        const left = 2 * index + 1;
        const right = 2 * index + 2;
        let current = index;

        if (left < this.data.length && this.comparer(this.data[left], this.data[current])) {
            current = left;
        }
        if (right < this.data.length && this.comparer(this.data[right], this.data[current])) {
            current = right;
        }
        if (current !== index) {
            [this.data[index], this.data[current]] = [this.data[current], this.data[index]];
            this.siftDown(current);
        }
    }

    public findAndRemove(value: T): boolean {
        const index = this.data.indexOf(value);
        if (index !== -1) {
            this.data[index] = this.data[this.data.length - 1];
            this.data.pop();

            const parent = Math.floor((index - 1) / 2);
            if (index > 0 && this.comparer(this.data[index], this.data[parent])) {
                this.siftUp(index);
            }
            else {
                this.siftDown(index);
            }
            return true;
        }
        return false;
    }
}

export default PriorityQueue;
