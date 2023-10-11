export class List<T> implements Iterable<T> {
    private capacity: number;
    private _length: number;
    private elements: T[];

    constructor() {
        this.capacity = 8;
        this._length = 0;
        this.elements = new Array<T>(this.capacity);
    }

    public push(item: T): void {
        if (this._length === this.capacity) {
            this.expandCapacity();
        }

        this.elements[this._length] = item;
        this._length++;
    }

    private expandCapacity(): void {
        this.capacity *= 2;
        const newElements = new Array<T>(this.capacity);

        for (let i = 0; i < this._length; i++) {
            newElements[i] = this.elements[i];
        }

        this.elements = newElements;
    }

    public get length() {
        return this._length;
    }

    public get(index: number): T {
        return this.elements[index];
    }

    public set(index: number, value: T): void {
        this.elements[index] = value;
    }

    public [Symbol.iterator](): Iterator<T> {
        let index = 0;
        return {
            next: (): IteratorResult<T> => {
                if (index < this._length) {
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
