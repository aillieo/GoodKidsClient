export class Deque<T> implements Iterator<T> {
    private capacity: number;
    private length: number;
    private elements: T[];
    private frontIndex: number;
    private rearIndex: number;

    constructor() {
        this.capacity = 10; // 初始容量为 10
        this.length = 0;
        this.elements = new Array<T>(this.capacity);
        this.frontIndex = 0;
        this.rearIndex = 0;
    }

    public pushFront(item: T): void {
        if (this.length === this.capacity) {
            this.expandCapacity();
        }

        this.frontIndex = (this.frontIndex - 1 + this.capacity) % this.capacity;
        this.elements[this.frontIndex] = item;
        this.length++;
    }

    public pushRear(item: T): void {
        if (this.length === this.capacity) {
            this.expandCapacity();
        }

        this.elements[this.rearIndex] = item;
        this.rearIndex = (this.rearIndex + 1) % this.capacity;
        this.length++;
    }

    private expandCapacity(): void {
        this.capacity *= 2;
        const newElements = new Array<T>(this.capacity);

        let newIndex = 0;
        for (let i = this.frontIndex; i !== this.rearIndex; i = (i + 1) % this.capacity) {
            newElements[newIndex] = this.elements[i];
            newIndex++;
        }

        this.elements = newElements;
        this.frontIndex = 0;
        this.rearIndex = this.length;
    }

    // 实现 Iterator<T> 接口
    private iteratorIndex = this.frontIndex;

    public next(): IteratorResult<T> {
        if (this.iteratorIndex !== this.rearIndex) {
            const value = this.elements[this.iteratorIndex];
            this.iteratorIndex = (this.iteratorIndex + 1) % this.capacity;
            return { value, done: false };
        } else {
            return { value: undefined, done: true };
        }
    }

    public [Symbol.iterator](): Iterator<T> {
        return this;
    }
}
