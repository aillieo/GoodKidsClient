import { _decorator, Component, Node, Label, log, Button } from "cc";
import { Binder} from "../../aillieo-utils/Binder";
import { Property } from "../../aillieo-utils/Property";
import { AppManager } from "../AppManager";
const { ccclass, property } = _decorator;

@ccclass("BasePage")
export class BasePage extends Component {
    onShow()  :  void{

    }

    protected onEnable(): void {
        log(this.name + "  Enable");
    }

    protected onDisable(): void {
        log(this.name + "  Disable");
    }
}
