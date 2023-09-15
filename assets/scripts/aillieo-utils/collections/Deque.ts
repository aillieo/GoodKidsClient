export class Deque<T> implements Iterable<T> {
    private capacity: number;
    private length: number;
    private elements: T[];
    private frontIndex: number;
    private rearIndex: number;

    constructor() {
        this.capacity = 8;
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

    public [Symbol.iterator](): Iterator<T> {
        let index = this.frontIndex;
        return {
            next: (): IteratorResult<T> => {
                if (index !== this.rearIndex) {
                    const value = this.elements[index];
                    index = (index + 1) % this.capacity;
                    return { value, done: false };
                } else {
                    return { value: undefined, done: true };
                }
            }
        };
    }
}
