import { Node, director, UITransform } from "cc";
import { Singleton } from "../../aillieo-utils/Singleton";
import { ResourceManager } from "../misc/ResourceManager";
import { BaseWindow } from "./BaseWindow";
import { UIConfig } from "./UIDefine";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = unknown> = new (...args: any[]) => T;

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

    public async open<T extends BaseWindow>(viewClass: Constructor<T>):Promise<T|null> {
        const uiCfg : UIConfig = (viewClass.prototype).__uiCfg;
        const node : Node = await ResourceManager.loadPrefab(uiCfg.bundleName, uiCfg.assetName);
        this.root!.addChild(node);
        return node.getComponent(BaseWindow) as T;
    }

    public close(window:BaseWindow) : void {
        ResourceManager.release(window.node);
    }
}
