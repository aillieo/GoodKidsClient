class Stack<T> {
    private readonly data: T[] = [];

    public push(x: T): void {
        this.data.push(x);
    }

    public pop(): T | undefined {
        return this.data.pop();
    }

    public peek(): T | undefined {
        return this.data[this.data.length - 1];
    }

    public count(): number {
        return this.data.length;
    }
}

export default Stack;
