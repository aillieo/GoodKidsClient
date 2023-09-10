import { _decorator, Component, Node, Label, log, Button, Prefab, instantiate, size, Size, Vec3 } from "cc";
import { Binder } from "../../aillieo-utils/Binder";
import { Property } from "../../aillieo-utils/Property";
import { DynamicScrollView } from "../../aillieo-utils/ui/DynamicScrollView";
import { BasePage } from "../main/BasePage";
import { DailyTaskItem } from "./DailyTaskItem";
import { DataManager } from "../model/DataManager";
const { ccclass, property } = _decorator;

@ccclass("PageDaily")
export class PageDaily extends BasePage {
    @property(Label)
        label: Label = null;

    @property
        text: string = "hello";

    @property(Prefab)
        itemPrefab : Prefab = null;

    @property(DynamicScrollView)
        listView : DynamicScrollView = null;

    onLoad() {

    }

    onEnable() {
        super.onEnable();

        this.listView.SetItemCountFunc(()=>50);
        this.listView.UpdateData();

        this.loadData();
    }

    private async loadData() {
        const dm : DataManager = DataManager.getInstance();

        const tasks = await dm.getDailyTasks();
        console.log(tasks);
    }
}
