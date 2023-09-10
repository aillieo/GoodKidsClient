import { _decorator, Component, Node, Label, log, Button } from "cc";
import { Binder } from "../../aillieo-utils/Binder";
import { Property } from "../../aillieo-utils/Property";
import { BasePage } from "../main/BasePage";
import { AppData, DataManager, TokenData, UserData } from "../model/DataManager";
import { HttpHelper } from "../../aillieo-utils/HttpHelper";
const { ccclass, property } = _decorator;

@ccclass("PageProfile")
export class PageProfile extends BasePage {

    @property(Label)
        labelName: Label = null;

    @property(Label)
        labelScore: Label = null;

    protected onEnable(): void {
        super.onEnable();
        this.loadData();
    }

    private async loadData() {
        const dm : DataManager = DataManager.getInstance();
        const data : TokenData = await dm.getUserData();
        console.log(data);
    }
}
