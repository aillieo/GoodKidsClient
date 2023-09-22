import { Button, Label, _decorator } from "cc";
import { Property } from "../../aillieo-utils/Property";
import { BaseWindow } from "./BaseWindow";
import { UIDefine } from "./UIDefine";
const { ccclass, property } = _decorator;

@UIDefine({ bundleName: "prefabs", assetName: "ui/UIDialogueView" })
@ccclass("UIDialogueView")
export class UIDialogueView extends BaseWindow {
    @property(Label)
        labelMsg: Label|null = null;

    @property(Button)
        buttonConfirm: Button|null = null;

    @property(Button)
        buttonCancel: Button|null = null;

    private state:Property<boolean|undefined> = new Property<boolean|undefined>(undefined);

    public async alert(message:string) : Promise<void> {
        // this.binder.clear();
        this.state.set(undefined);
        this.labelMsg!.string = message;

        return new Promise<void>((resolve) => {
            this.binder.bindProperty(this.state, () => {
                resolve();
                // this.binder.clear();
            });
        });
    }

    public async ask(message:string) : Promise<boolean> {
        // this.binder.clear();
        this.state.set(undefined);
        this.labelMsg!.string = message;

        return new Promise<boolean>((resolve) => {
            this.binder.bindProperty(this.state, (v:boolean|undefined) => {
                if (v !== undefined) {
                    resolve(v);
                    // this.binder.clear();
                }
            });
        });
    }

    protected onEnable(): void {
        super.onEnable?.();

        this.binder.bindV_ButtonClick(this.buttonConfirm!, () => this.onConfirm());
        this.binder.bindV_ButtonClick(this.buttonCancel!, () => this.onCancel());
    }

    protected onDisable() {
        super.onDisable?.();

        this.binder.clear();
    }

    private onConfirm() : void {
        this.state.set(true);
    }

    private onCancel() : void {
        this.state.set(false);
    }
}
