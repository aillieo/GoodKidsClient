import { Button, EditBox, _decorator } from "cc";
import { BaseWindow } from "../uiframework/BaseWindow";
import { UIDefine } from "../uiframework/UIDefine";
import { UIManager } from "../uiframework/UIManager";
import { DailyTaskModel } from "../model/DailyTaskModel";
import { Models } from "../model/Models";
const { ccclass, property } = _decorator;

@UIDefine({ bundleName: "prefabs", assetName: "daily/UIDailyTaskCreate" })
@ccclass("UIDailyTaskCreate")
export class UIDailyTaskCreate extends BaseWindow {
    @property(EditBox)
        editBoxTaskName: EditBox|null = null;

    @property(EditBox)
        editBoxTaskDes: EditBox|null = null;

    @property(Button)
        buttonConfirm: Button|null = null;

    @property(Button)
        buttonClose: Button|null = null;

    protected onEnable(): void {
        super.onEnable?.();

        this.binder.bindV_ButtonClick(this.buttonConfirm!, () => this.onConfirm());
        this.binder.bindV_ButtonClick(this.buttonClose!, () => this.onClose());
    }

    protected onDisable() {
        super.onDisable?.();

        this.binder.clear();
    }

    private onConfirm() : void {
        Models.get(DailyTaskModel).createTask(
            this.editBoxTaskName!.string,
            this.editBoxTaskDes!.string).then((succ) => {
            if (succ) {
                Models.get(DailyTaskModel).getDailyTasks();
                UIManager.getInstance().close(this);
            }
        });
    }

    private onClose() : void {
        UIManager.getInstance().close(this);
    }
}
