export class List<T> implements Iterable<T> {
    private capacity: number;
    private length: number;
    private elements: T[];

    constructor() {
        this.capacity = 8;
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

    public [Symbol.iterator](): Iterator<T> {
        let index = 0;
        return {
            next: (): IteratorResult<T> => {
                if (index < this.length) {
                    const value = this.elements[index];
                    index++;
                    return { value, done: false };
                } else {
                    return { value: undefined, done: true };
                }
            }
        };
    }
}
