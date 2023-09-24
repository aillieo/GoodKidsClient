import { Button, _decorator } from "cc";
import { BaseWindow } from "../uiframework/BaseWindow";
import { UIDefine } from "../uiframework/UIDefine";
import { UIManager } from "../uiframework/UIManager";
import { UIItemCreate } from "./UIItemCreate";
import { DynamicScrollView } from "../../aillieo-utils/ui/DynamicScrollView";
import { ItemModel } from "../model/ItemModel";
import { Models } from "../model/Models";
import { Logger } from "../misc/Logger";
import { ItemItem } from "./ItemItem";
const { ccclass, property } = _decorator;

@UIDefine({ bundleName: "prefabs", assetName: "profile/UIItemManage" })
@ccclass("UIItemManage")
export class UIItemManage extends BaseWindow {
    @property(Button)
        buttonCreate: Button|null = null;

    @property(Button)
        buttonClose: Button|null = null;

    @property(DynamicScrollView)
        listView: DynamicScrollView|null = null;

    protected onEnable(): void {
        super.onEnable?.();

        this.binder.bindV_ButtonClick(this.buttonCreate!, () => this.onCreate());
        this.binder.bindV_ButtonClick(this.buttonClose!, () => this.onClose());

        this.binder.bindProperty(Models.get(ItemModel).items, () => this.onItemsUpdate());

        Models.get(ItemModel).getItems();
    }

    protected onDisable() {
        super.onDisable?.();

        this.binder.clear();
        this.listView!.ResetAllDelegates();
    }

    private onCreate() : void {
        UIManager.getInstance().open(UIItemCreate);
    }

    private onClose() : void {
        UIManager.getInstance().close(this);
    }

    private onItemsUpdate() : void {
        const items = Models.get(ItemModel).items.get();
        Logger.get(UIItemManage).log(items);
        this.listView!.SetItemCountFunc(() => items.length);
        this.listView!.SetUpdateFunc((idx, item) => {
            item.node.getComponent(ItemItem)?.setData(items[idx]);
        });
        this.listView!.UpdateData();
    }
}
