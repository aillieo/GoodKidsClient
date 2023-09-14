import { Delegate, type Handle } from "./Delegate";
import { type Action1 } from "./Action";
type EventName = string|number

export class EventEmitter {
    private map: Map<EventName, Delegate<unknown>> = new Map();

    public on(evt: EventName, callback: Action1<unknown>) : Handle {
        let del: Delegate<unknown>|undefined = this.map.get(evt);
        if (!del) {
            del = new Delegate<unknown>();
            this.map.set(evt, del);
        }
        return del.add(callback);
    }

    public once(evt: EventName, callback: Action1<unknown>) : Handle {
        const f: Action1<unknown> = (args) => {
            callback(args);
            this.off(evt, f);
        };
        return this.on(evt, f);
    }

    public off(evt: EventName, callback: Action1<unknown>) : void {
        const del: Delegate<unknown>|undefined = this.map.get(evt);
        del && del.removeValue(callback);
    }

    public allOff(evt?: EventName) : void {
        if (!evt) {
            this.map.clear();
            return;
        }

        this.map.delete(evt);
    }

    public emit(evt: EventName, args: unknown) : void {
        const del: Delegate<unknown>|undefined = this.map.get(evt);
        if (!del) return;
        del.invoke(args);
    }
}
