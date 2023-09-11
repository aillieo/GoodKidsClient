import { _decorator, Component, Node, Label, log, Button } from "cc";
import { Property } from "../../aillieo-utils/Property";
import { UIBinder } from "../../aillieo-utils/ui/UIBinder";
import { AppManager } from "../AppManager";
const { ccclass, property } = _decorator;

@ccclass("BasePage")
export class BasePage extends Component {
    protected binder : UIBinder = new UIBinder();

    onShow() : void {

    }

    protected onEnable(): void {

    }

    protected onDisable(): void {

    }
}
