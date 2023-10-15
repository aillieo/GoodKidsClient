import { type Delegate, type Handle, Action } from "./Delegate";
import { type Property } from "./Property";

export interface BinderLike {
    bindProperty<T>(prop: Property<T>, listener: Action<T>): void;
    bindEvent<T>(evt: Delegate<T>, listener: Action<T>): void;
    clear(): void;
}

export class Binder implements BinderLike {
    private bindings: Handle[];

    constructor() {
        this.bindings = [];
    }

    public bindProperty<T>(prop: Property<T>, listener: Action<T>): void {
        const handle = prop.addListener(listener);
        this.bindings.push(handle);
        listener(prop.get());
    }

    public bindEvent<T>(evt: Delegate<T>, listener: Action<T>): void {
        const handle = evt.add(listener);
        this.bindings.push(handle);
    }

    public clear(): void {
        for (const handle of this.bindings) {
            handle.unlisten();
        }

        this.bindings = [];
    }
}
