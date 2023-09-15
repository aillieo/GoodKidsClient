class Queue<T> {
    private data: T[];
    private head: number;
    private tail: number;
    private capacity: number;

    constructor() {
        this.data = new Array<T>(0);
        this.head = 0;
        this.tail = 0;
        this.capacity = 0;
    }

    private resize(newCapacity: number): void {
        const newData: T[] = new Array<T>(newCapacity);
        for (let i = 0, j = this.head; i < this.count(); i++, j = (j + 1) % this.capacity) {
            newData[i] = this.data[j];
        }
        this.data = newData;
        this.head = 0;
        this.tail = this.count();
        this.capacity = newCapacity;
    }

    public enqueue(x: T): void {
        if (this.count() === this.capacity - 1) {
            this.resize(this.capacity * 2);
        }
        this.data[this.tail] = x;
        this.tail = (this.tail + 1) % this.capacity;
    }

    public dequeue(): T | undefined {
        if (this.count() === 0) {
            return undefined;
        }
        const obj = this.data[this.head];
        this.head = (this.head + 1) % this.capacity;
        return obj;
    }

    public count(): number {
        return (this.tail - this.head + this.capacity) % this.capacity;
    }

    public clear(): void {
        this.head = 0;
        this.tail = 0;
    }
}

export default Queue;
