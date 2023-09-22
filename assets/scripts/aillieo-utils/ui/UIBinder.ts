import { Button, Toggle, Node, Label } from "cc";
import { Action, Delegate } from "../Delegate";
import { Binder, BinderLike } from "../Binder";
import { Property } from "../Property";

export type CallbackRecord = {
    node:Node,
    eventName:string,
    callback: ()=>void,
}

export class UIBinder implements BinderLike {
    private binder : Binder = new Binder();
    private records : CallbackRecord[] = new Array<CallbackRecord>(0);

    public bindProperty<T>(prop: Property<T>, listener: Action<T>): void {
        this.binder.bindProperty(prop, listener);
    }

    public bindEvent<T>(evt: Delegate<T>, listener: Action<T>): void {
        this.binder.bindEvent(evt, listener);
    }

    public clear():void {
        this.binder.clear();
        for (const r of this.records) {
            r.node.off(r.eventName, r.callback);
        }
    }

    public bindM2V_ToggleIsOn(prop: Property<boolean>, toggle: Toggle) {
        this.binder.bindProperty(prop, (b) => { toggle.isChecked = b; });
    }

    public bindM2V_Number_LabelString(prop: Property<number>, label: Label, mapper?: (n:number)=>string) {
        if (mapper === undefined) {
            this.binder.bindProperty(prop, (n) => { label.string = n.toString(); });
        } else {
            this.binder.bindProperty(prop, (n) => { label.string = mapper!(n); });
        }
    }

    public bindM2V_String_LabelString(prop: Property<string>, label: Label, mapper?: (s:string)=>string) {
        if (mapper === undefined) {
            this.binder.bindProperty(prop, (s) => { label.string = s; });
        } else {
            this.binder.bindProperty(prop, (s) => { label.string = mapper!(s); });
        }
    }

    public bindV_ButtonClick(button: Button, f:()=>void) {
        // todo 换用Delegate
        const r : CallbackRecord = {
            node: button.node,
            eventName: Button.EventType.CLICK,
            callback: f
        };

        this.records.push(r);
        button.node.on(Button.EventType.CLICK, f);
    }

    public bindV2M_ToggleIsOn(toggle: Toggle, prop: Property<boolean>) {
        // todo 换用Delegate
        const f = () => { prop.set(toggle.isChecked); };
        const r : CallbackRecord = {
            node: toggle.node,
            eventName: "toggle",
            callback: f
        };

        this.records.push(r);
        toggle.node.on("toggle", f);
    }
}
