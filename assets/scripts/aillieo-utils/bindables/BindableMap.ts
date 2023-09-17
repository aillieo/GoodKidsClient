import { Action1 } from "../Action";
import { EventEmitter } from "../EventEmitter";

enum EventType{
    ADD = "add",
    UPDATE = "update",
    DELETE = "delete",
    CLEAR = "clear",
}

type ArgType<K> = K | undefined;

class BindableMap<K, V> implements Map<K, V> {
    private map: Map<K, V>;
    private events: EventEmitter<EventType, ArgType<K>>;

    constructor(entries?: readonly (readonly [K, V])[] | null) {
        this.events = new EventEmitter<EventType, ArgType<K>>();
        this.map = new Map(entries);
    }

    on(evt: EventType, listener: Action1<ArgType<K>>): void {
        this.events.on(evt, listener);
    }

    off(evt: EventType, listener: Action1<ArgType<K>>): void {
        this.events.off(evt, listener);
    }

    get size(): number {
        return this.map.size;
    }

    clear(): void {
        this.map.clear();
        this.events.emit(EventType.UPDATE, undefined);
    }

    delete(key: K): boolean {
        if (this.map.has(key)) {
            const result = this.map.delete(key);
            this.events.emit(EventType.DELETE, key);
            return result;
        }
        return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
        this.map.forEach(callbackfn, thisArg);
    }

    get(key: K): V | undefined {
        return this.map.get(key);
    }

    has(key: K): boolean {
        return this.map.has(key);
    }

    set(key: K, value: V): this {
        const has = this.has(key);
        this.map.set(key, value);
        if (has) {
            this.events.emit(EventType.UPDATE, key);
        } else {
            this.events.emit(EventType.ADD, key);
        }
        return this;
    }

    [Symbol.iterator](): IterableIterator<[K, V]> {
        return this.map[Symbol.iterator]();
    }

    entries(): IterableIterator<[K, V]> {
        return this.map.entries();
    }

    keys(): IterableIterator<K> {
        return this.map.keys();
    }

    values(): IterableIterator<V> {
        return this.map.values();
    }

    get [Symbol.toStringTag](): string {
        return this.map[Symbol.toStringTag];
    }
}

export { BindableMap };
