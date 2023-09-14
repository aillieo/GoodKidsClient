import { _decorator, Label, Button } from "cc";
import { DataManager } from "../model/DataManager";
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

    public setData(taskData: object):void {
        this.taskId = taskData.id;
        this.taskName.string = taskData.taskName;
        this.taskDes.string = taskData.taskDes;
    }

    private onCompleteClick() {
        DataManager.getInstance().completeTask(this.taskId);
    }
}
