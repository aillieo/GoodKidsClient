import { _decorator, Label, Button, Prefab, EditBox } from "cc";
import { DynamicScrollView } from "../../aillieo-utils/ui/DynamicScrollView";
import { BasePage } from "../main/BasePage";
import { DailyTaskModel } from "../model/DailyTaskModel";
import { DailyTaskItem } from "./DailyTaskItem";
import { Logger } from "../misc/Logger";
import { Models } from "../model/Models";
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

    onEnable() {
        super.onEnable();

        this.binder.bindV_ButtonClick(this.buttonCreate!, () => this.onCreateTaskClick());
        this.binder.bindProperty(Models.get(DailyTaskModel).tasks, () => this.onTasksUpdate());

        Models.get(DailyTaskModel).getDailyTasks();
    }

    protected onDisable() {
        super.onDisable?.();
        this.binder.clear();

        this.listView!.ResetAllDelegates();
    }

    private onTasksUpdate():void {
        const tasks = Models.get(DailyTaskModel).tasks.get();
        Logger.get(PageDaily).log(tasks);
        this.listView!.SetItemCountFunc(() => tasks.length);
        this.listView!.SetUpdateFunc((idx, item) => {
            item.node.getComponent(DailyTaskItem)?.setData(tasks[idx]);
        });
        this.listView!.UpdateData();
    }

    private onCreateTaskClick() :void {
        Models.get(DailyTaskModel).createTask(
            this.editBoxTaskName!.string,
            this.editBoxTaskDes!.string).then((succ) => {
            if (succ) {
                Models.get(DailyTaskModel).getDailyTasks();
            }
        });
    }
}
