import { _decorator, Component, Node, Label, log, Button, Prefab, instantiate, size, Size, Vec3 } from "cc";
import { DynamicScrollView } from "../../aillieo-utils/ui/DynamicScrollView";
import { BasePage } from "../main/BasePage";
import { DailyTaskItem } from "./DailyTaskItem";
import { DataManager } from "../model/DataManager";
const { ccclass, property } = _decorator;

@ccclass("PageDaily")
export class PageDaily extends BasePage {
    @property(Label)
        label: Label|null = null;

    @property
        text: string = "hello";

    @property(Prefab)
        itemPrefab: Prefab|null = null;

    @property(DynamicScrollView)
        listView: DynamicScrollView|null = null;

    @property(Button)
        buttonCreate: Button|null = null;

    onLoad() {

    }

    onEnable() {
        super.onEnable();

        this.listView!.SetItemCountFunc(() => 50);
        this.listView!.UpdateData();

        this.loadData();

        const that = this;
        this.binder.BindV_ButtonClick(this.buttonCreate!, () => that.onCreateTaskClick());
    }

    protected onDisable() {
        super.onDisable?.();
        this.binder.clear();
    }

    private async loadData() {
        const dm: DataManager = DataManager.getInstance();

        const tasks = await dm.getDailyTasks();
        console.log(tasks);
    }

    private onCreateTaskClick() :void {
        DataManager.getInstance().createTask();
    }
}
