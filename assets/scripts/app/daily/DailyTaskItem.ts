import { _decorator, Label, Button } from "cc";
import { DailyTaskModel } from "../model/DailyTaskModel";
import { BaseView } from "../uiframework/BaseView";
import { DailyTask } from "../schemas/DailyTask";
import { Models } from "../model/Models";
const { ccclass, property } = _decorator;

@ccclass("DailyTaskItem")
export class DailyTaskItem extends BaseView {
    @property(Label)
    public taskName : Label = null!;

    @property(Label)
    public taskDes : Label = null!;

    @property(Button)
        buttonCreate: Button|null = null;

    private taskId:number = 0;

    protected onEnable() {
        super.onEnable?.();

        const that = this;
        this.binder.bindV_ButtonClick(this.buttonCreate!, () => that.onCompleteClick());
    }

    public setData(taskData: DailyTask):void {
        this.taskId = taskData.id;
        this.taskName.string = taskData.taskName;
        this.taskDes.string = taskData.taskDes;
    }

    private onCompleteClick() {
        Models.get(DailyTaskModel).completeTask(this.taskId).then((succ) => {
            if (succ) {
                Models.get(DailyTaskModel).getDailyTasks();
            }
        });
    }
}
