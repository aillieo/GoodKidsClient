import { Button, EditBox, Label, _decorator } from "cc";
import { Property } from "../../aillieo-utils/Property";
import { BaseWindow } from "../uiframework/BaseWindow";
import { UIDefine } from "../uiframework/UIDefine";
import { UIManager } from "../uiframework/UIManager";
const { ccclass, property } = _decorator;

@UIDefine({ bundleName: "prefabs", assetName: "ui/UIItemCreate" })
@ccclass("UIItemCreate")
export class UIItemCreate extends BaseWindow {
    @property(Button)
        buttonConfirm: Button|null = null;

    @property(Button)
        buttonClose: Button|null = null;

    @property(EditBox)
        editBoxItemName: EditBox|null = null;

    protected onEnable(): void {
        super.onEnable?.();

        this.binder.bindV_ButtonClick(this.buttonConfirm!, () => this.onConfirm());
        this.binder.bindV_ButtonClick(this.buttonClose!, () => this.onClose());
    }

    protected onDisable() {
        super.onDisable?.();

        this.binder.clear();
    }

    private onConfirm() : void {

    }

    private onClose() : void {
        UIManager.getInstance().close(this);
    }
}
