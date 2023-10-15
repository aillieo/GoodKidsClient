import { Delegate, type Handle, Action } from "./Delegate";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class EventEmitter<TEvent = string | number, TArg = any> {
    private map: Map<TEvent, Delegate<TArg>> = new Map();

    public on(evt: TEvent, callback: Action<TArg>): Handle {
        let del: Delegate<TArg> | undefined = this.map.get(evt);
        if (!del) {
            del = new Delegate<TArg>();
            this.map.set(evt, del);
        }
        return del.add(callback);
    }

    public once(evt: TEvent, callback: Action<TArg>): Handle {
        const f: Action<TArg> = (args) => {
            callback(args);
            this.off(evt, f);
        };
        return this.on(evt, f);
    }

    public off(evt: TEvent, callback: Action<TArg>): void {
        const del: Delegate<TArg> | undefined = this.map.get(evt);
        del && del.removeValue(callback);
    }

    public allOff(evt?: TEvent): void {
        if (!evt) {
            this.map.clear();
            return;
        }

        this.map.delete(evt);
    }

    public emit(evt: TEvent, args: TArg): void {
        const del: Delegate<TArg> | undefined = this.map.get(evt);
        if (!del) return;
        del.invoke(args);
    }
}
