import { Action1 } from "../Action";
import { EventEmitter } from "../EventEmitter";

enum EventType{
    ADD = "add",
    UPDATE = "update",
    DELETE = "delete",
    CLEAR = "clear",
}

type ArgType = number | undefined;

class BindableArray<T> {
    private array: T[];
    private events: EventEmitter<EventType, ArgType>;

    constructor(...items: T[]) {
        this.events = new EventEmitter<EventType, ArgType>();
        this.array = new Array<T>(...items);
    }

    on(evt: EventType, listener: Action1<ArgType>): void {
        this.events.on(evt, listener);
    }

    off(evt: EventType, listener: Action1<ArgType>): void {
        this.events.off(evt, listener);
    }

    push(value: T): number {
        const result = this.array.push(value);
        this.events.emit(EventType.ADD, result);
        return result;
    }

    get(index: number): T | undefined {
        return this.array[index];
    }

    set(index: number, value: T): void {
        this.array[index] = value;
        this.events.emit(EventType.UPDATE, index);
    }

    delete(index: number): void {
        delete this.array[index];
        this.events.emit(EventType.DELETE, index);
    }

    clear(): void {
        this.array.length = 0;
        this.events.emit(EventType.CLEAR, undefined);
    }

    get length(): number {
        return this.array.length;
    }
}

export { BindableArray };
