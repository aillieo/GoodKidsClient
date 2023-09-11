export class List<T> implements Iterator<T> {
    private capacity: number;
    private length: number;
    private elements: T[];

    constructor() {
        this.capacity = 10; // 初始容量为 10
        this.length = 0;
        this.elements = new Array<T>(this.capacity);
    }

    public push(item: T): void {
        if (this.length === this.capacity) {
            this.expandCapacity();
        }

        this.elements[this.length] = item;
        this.length++;
    }

    private expandCapacity(): void {
        this.capacity *= 2;
        const newElements = new Array<T>(this.capacity);

        for (let i = 0; i < this.length; i++) {
            newElements[i] = this.elements[i];
        }

        this.elements = newElements;
    }

    // 实现 Iterator<T> 接口
    private iteratorIndex = 0;

    public next(): IteratorResult<T> {
        if (this.iteratorIndex < this.length) {
            const value = this.elements[this.iteratorIndex];
            this.iteratorIndex++;
            return {
                value, done: false
            };
        } else {
            return {
                value: undefined, done: true
            };
        }
    }

    public [Symbol.iterator](): Iterator<T> {
        return this;
    }
}
