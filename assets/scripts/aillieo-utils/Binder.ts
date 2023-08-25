import { Action1 } from "./Action";
import { Delegate, Handle } from "./Delegate";
import { Property } from "./Property";

export class Binder {
    private bindings : Handle[];

    constructor() {
        this.bindings = [];
    }

    public bindProperty<T>(prop: Property<T>, listener: Action1<T>) : void {
        const handle = prop.addListener(listener);
        this.bindings.push(handle);
        listener(prop.get());
    }

    public bindEvent<T>(evt: Delegate<T>, listener: Action1<T>) : void {
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
