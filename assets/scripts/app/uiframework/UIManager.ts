import { _decorator, Component, Node } from "cc";
import { Singleton } from "../../aillieo-utils/Singleton";
import { Property } from "../../aillieo-utils/Property";
import { utils } from "../utils/utils";
import { BaseWindow } from "./BaseWindow";

const { ccclass, property } = _decorator;

// eslint-disable-next-line no-use-before-define
export class UIManager extends Singleton<UIManager>() {
    public async Open(name:string):Promise<BaseWindow|null> {
        console.log(name);
        const node : Node = await utils.loadPrefab("ui", name);
        return node.getComponent(BaseWindow);
    }

    public Close(window:BaseWindow) : void {
        window.node.destroy();
    }
}
