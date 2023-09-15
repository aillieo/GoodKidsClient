import { _decorator, Label, Button } from "cc";
import { DailyTaskModel, TaskData } from "../model/DailyTaskModel";
import { BaseView } from "../uiframework/BaseView";
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

    public setData(taskData: TaskData):void {
        this.taskId = taskData.id;
        this.taskName.string = taskData.taskName;
        this.taskDes.string = taskData.taskDes;
    }

    private onCompleteClick() {
        DailyTaskModel.getInstance().completeTask(this.taskId).then((succ) => {
            if (succ) {
                DailyTaskModel.getInstance().getDailyTasks();
            }
        });
    }
}
