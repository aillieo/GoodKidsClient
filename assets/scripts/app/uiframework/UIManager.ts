import { Node, director, UITransform, view } from "cc";
import { Singleton } from "../../aillieo-utils/Singleton";
import { Utils } from "../misc/Utils";
import { BaseWindow } from "./BaseWindow";
import { Ctor, UIConfig } from "./UIDefine";

// eslint-disable-next-line no-use-before-define
export class UIManager extends Singleton<UIManager>() {
    private root : Node | null = null;

    protected constructor() {
        super();

        const canvas : Node|null = director.getScene()!.getChildByName("Canvas");
        let UIRoot = canvas!.getChildByName("UIRoot");
        if (UIRoot == null) {
            UIRoot = new Node("UIRoot");
            UIRoot.addComponent(UITransform);
            UIRoot.setParent(canvas, false);
        }

        this.root = UIRoot;
    }

    public async open<T extends BaseWindow>(viewClass: Ctor<T>):Promise<T|null> {
        const uiCfg : UIConfig = (viewClass.prototype).__uiCfg;
        const node : Node = await Utils.loadPrefab(uiCfg.bundleName, uiCfg.assetName);
        this.root!.addChild(node);
        return node.getComponent(BaseWindow) as T;
    }

    public close(window:BaseWindow) : void {
        window.node.destroy();
    }
}
