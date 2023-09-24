import { _decorator, Label, Button } from "cc";
import { BaseView } from "../uiframework/BaseView";
import { Item } from "../schemas/Item";
import { UIManager } from "../uiframework/UIManager";
import { UIItemCreate } from "./UIItemCreate";
const { ccclass, property } = _decorator;

@ccclass("ItemItem")
export class ItemItem extends BaseView {
    @property(Label)
    public itemName : Label = null!;

    @property(Label)
    public itemDes : Label = null!;

    @property(Button)
        buttonEdit: Button|null = null;

    private itemId:number = 0;

    protected onEnable() {
        super.onEnable?.();

        this.binder.bindV_ButtonClick(this.buttonEdit!, () => this.onEditClick());
    }

    public setData(itemData: Item):void {
        this.itemId = itemData.id;
        this.itemName.string = itemData.name;
        this.itemDes.string = itemData.icon;
    }

    private onEditClick() {
        UIManager.getInstance().open(UIItemCreate);
    }
}
