import { _decorator, Component, Node, Label, log, Button } from "cc";
import { Binder} from "../../aillieo-utils/Binder";
import { Property } from "../../aillieo-utils/Property";
import { BasePage } from "../main/BasePage";
import { AppData, DataManager } from "../model/DataManager";
const { ccclass, property } = _decorator;

@ccclass("PageProfile")
export class PageProfile extends BasePage {

    protected onEnable(): void {
        super.onEnable();
        this.loadData();
    }

    private async loadData() {
        const dm : DataManager = DataManager.getInstance();
        const data : AppData = await dm.getData();
        data.age +=1;
        console.log(data);
    }
}
