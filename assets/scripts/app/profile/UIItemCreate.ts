import { Button, EditBox, _decorator } from "cc";
import { BaseWindow } from "../uiframework/BaseWindow";
import { UIDefine } from "../uiframework/UIDefine";
import { UIManager } from "../uiframework/UIManager";
import { Item } from "../schemas/Item";
import { Models } from "../model/Models";
import { ItemModel } from "../model/ItemModel";
const { ccclass, property } = _decorator;

@UIDefine({ bundleName: "prefabs", assetName: "profile/UIItemCreate" })
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
        const itemData : Item = { id: 0, name: "", icon: "" };
        Models.get(ItemModel).modifyItem(itemData).then((succ) => {
            if (succ) {
                Models.get(ItemModel).getItems();
            }
        });
    }

    private onClose() : void {
        UIManager.getInstance().close(this);
    }
}
