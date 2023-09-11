import { _decorator } from "cc";
import { UIBinder } from "../../aillieo-utils/ui/UIBinder";
import { BaseView } from "./BaseView";

const { ccclass } = _decorator;

@ccclass("BaseWindow")
export class BaseWindow extends BaseView {
    protected binder : UIBinder = new UIBinder();
}
