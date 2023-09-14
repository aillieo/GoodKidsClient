import { _decorator, Label, Button, Prefab, EditBox } from "cc";
import { DynamicScrollView } from "../../aillieo-utils/ui/DynamicScrollView";
import { BasePage } from "../main/BasePage";
import { DataManager } from "../model/DataManager";
import { DailyTaskItem } from "./DailyTaskItem";
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

    @property(EditBox)
        editBoxTaskName: EditBox|null = null;

    @property(EditBox)
        editBoxTaskDes: EditBox|null = null;

    onLoad() {

    }

    onEnable() {
        super.onEnable();

        this.listView!.SetItemCountFunc(() => 50);
        this.listView!.UpdateData();

        this.loadData();

        const that = this;
        this.binder.bindV_ButtonClick(this.buttonCreate!, () => that.onCreateTaskClick());
    }

    protected onDisable() {
        super.onDisable?.();
        this.binder.clear();

        this.listView!.ResetAllDelegates();
    }

    private async loadData() {
        const dm: DataManager = DataManager.getInstance();

        const tasks = await dm.getDailyTasks();
        console.log(tasks);
        this.listView!.SetItemCountFunc(() => tasks.length);
        this.listView!.SetUpdateFunc((idx, item) => {
            item.node.getComponent(DailyTaskItem)?.setData(tasks[idx]);
        });
        this.listView!.UpdateData();
    }

    private onCreateTaskClick() :void {
        DataManager.getInstance().createTask(
            this.editBoxTaskName?.string,
            this.editBoxTaskDes?.string);
    }
}
