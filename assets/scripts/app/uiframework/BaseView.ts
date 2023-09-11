import { _decorator, Component } from "cc";
import { UIBinder } from "../../aillieo-utils/ui/UIBinder";

const { ccclass } = _decorator;

@ccclass("BaseView")
export class BaseView extends Component {
    protected binder : UIBinder = new UIBinder();
}
