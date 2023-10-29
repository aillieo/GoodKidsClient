import { _decorator, Node, director, UITransform, Size, Sprite, Button, Color } from "cc";
import { BaseWindow } from "./BaseWindow";
import { UIDefine } from "./UIDefine";
import { UIManager } from "./UIManager";
import { Logger } from "../misc/Logger";
const { ccclass } = _decorator;

type CloseHandle = () => void;
interface LoadingRequest {
    info: string,
}

@UIDefine({ bundleName: "prefabs", assetName: "ui/UILoadingIndicator" })
@ccclass("UILoadingIndicator")
export class UILoadingIndicator extends BaseWindow {
    private static loadingRequests: Set<LoadingRequest> = new Set<LoadingRequest>();
    private static blocker: Node | null = null;
    // eslint-disable-next-line no-use-before-define
    private static loadingIns: Promise<UILoadingIndicator | null> | null = null;

    public static show(info?: string): CloseHandle {
        if (!info) {
            info = "";
        }
        const req: LoadingRequest = { info };

        UILoadingIndicator.loadingRequests.add(req);

        if (UILoadingIndicator.loadingRequests.size === 1) {
            this.enableBlocker();
        }

        return () => { UILoadingIndicator.close(req); };
    }

    private static close(loadingRequest: LoadingRequest): void {
        if (!this.loadingRequests.delete(loadingRequest)) {
            return;
        }

        if (UILoadingIndicator.loadingRequests.size === 0) {
            this.disableBlocker();
        }
    }

    private static ensureBlocker(): void {
        if (!UILoadingIndicator.blocker) {
            UILoadingIndicator.blocker = new Node();

            const canvas: Node = director.getScene()!.getChildByName("Canvas")!;
            let blocker = canvas!.getChildByName("UILoadingIndicatorBlocker");
            if (blocker == null) {
                blocker = new Node("UILoadingIndicatorBlocker");
                const blockerRect: UITransform = blocker.addComponent(UITransform);
                blocker.setParent(canvas, false);
                blocker.setSiblingIndex(canvas.children.length - 1);
                blockerRect.contentSize = new Size(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
                const blockerImage: Sprite = blocker.addComponent(Sprite);
                blockerImage.color = Color.TRANSPARENT;
                const blockerButton: Button = blocker.addComponent(Button);
                blockerButton.node.on(Button.EventType.CLICK, UILoadingIndicator.click);
            }
        }
    }

    private static enableBlocker(): void {
        this.ensureBlocker();
        UILoadingIndicator.blocker!.active = true;

        if (!UILoadingIndicator.loadingIns) {
            UILoadingIndicator.loadingIns = UIManager.getInstance().open(UILoadingIndicator);
        }
    }

    private static disableBlocker(): void {
        this.ensureBlocker();
        UILoadingIndicator.blocker!.active = false;

        if (UILoadingIndicator.loadingIns) {
            const loadingIns = UILoadingIndicator.loadingIns;
            UILoadingIndicator.loadingIns = null;

            loadingIns.then(view => {
                if (view) {
                    UIManager.getInstance().close(view);
                }
            });
        }
    }

    private static click(): void {
        Logger.get(UILoadingIndicator).log("click");
    }
}
