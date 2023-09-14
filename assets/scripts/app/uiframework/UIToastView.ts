import { Label, Tween, tween, Vec3, _decorator, Node } from "cc";
import { Utils } from "../misc/Utils";
import { BaseWindow } from "./BaseWindow";
import { UIDefine } from "./UIDefine";
const { ccclass, property } = _decorator;

@UIDefine({ bundleName: "prefabs", assetName: "ui/UIToastView" })
@ccclass("UIToastView")
export class UIToastView extends BaseWindow {
    @property(Label)
        labelMsg: Label|null = null;

    public async showMessage(message:string):Promise<void> {
        console.log(message);
        this.labelMsg!.string = message;
        this.node.scale = new Vec3(1, 0, 1);

        const t:Tween<Node> = tween(this.node)
            .to(0.2, { scale: new Vec3(1, 1, 1) })
            .delay(1);

        await Utils.startTweenAsync(t);
    }
}
