import { Delegate, type Handle } from "./Delegate";
import { type Action1 } from "./Action";

export class EventCenter {
    private map: Map<string, Delegate<unknown>>;

    constructor() {
        this.map = new Map<string, Delegate<unknown>>();
    }

    public on(evt: string, callback: Action1<unknown>): Handle {
        let del: Delegate<unknown>;
        if (!this.map.has(evt)) {
            del = new Delegate<unknown>();
            this.map[evt] = del;
        } else {
            del = this.map[evt];
        }

        return del.add(callback);
    }

    public off(evt: string, handle: Handle): void {
        let del: Delegate<unknown>;
        if (!this.map.has(evt)) {
            del = new Delegate<unknown>();
            this.map[evt] = del;
        } else {
            del = this.map[evt];
        }

        del.remove(handle);
    }
}
