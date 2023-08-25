import { Action0, Action1 } from "./Action";
import { Delegate, Handle } from "./Delegate";
export type PropertyEqualityFn<T> = (newValue: T, oldValue: T) => boolean;

class Property<T> {
    private value: T;
    private listeners: Delegate<T>;
    private equalityFn: PropertyEqualityFn<T>;

    constructor(initialValue: T, equalityFn?: PropertyEqualityFn<T>) {
        this.value = initialValue;
        this.listeners = new Delegate<T>();
        this.equalityFn = equalityFn || ((newValue, oldValue) => newValue !== oldValue);
    }

    public get(): T {
        return this.value;
    }

    public set(newValue: T): void {
        if (this.equalityFn(newValue, this.value)) {
            this.value = newValue;
            this.emitPropertyChanged();
        }
    }

    public addListener(listener: Action0 | Action1<T>): Handle {
        return this.listeners.add(listener);
    }

    public remove(handle: Handle): boolean {
        return this.listeners.remove(handle);
    }

    public removeListener(listener: Action0 | Action1<T>): boolean {
        return this.listeners.removeValue(listener);
    }

    private emitPropertyChanged(): void {
        this.listeners.safeInvoke(this.value);
    }
}

export { Property };
