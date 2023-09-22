import { type Handle, type Action } from "./Delegate";
import { EventEmitter } from "./EventEmitter";

export class EventCenter {
    private static eventEmitter : EventEmitter = new EventEmitter();

    public static on(evt: string, callback: Action<unknown>): Handle {
        return this.eventEmitter.on(evt, callback);
    }

    public static once(evt: string, callback: Action<unknown>) : Handle {
        return this.eventEmitter.once(evt, callback);
    }

    public static off(evt: string, callback: Action<unknown>): void {
        this.eventEmitter.off(evt, callback);
    }

    public static allOff(evt?: string) : void {
        this.eventEmitter.allOff(evt);
    }

    public static emit(evt: string, args: unknown) : void {
        this.eventEmitter.emit(evt, args);
    }
}
