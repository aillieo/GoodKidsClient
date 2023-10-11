import { Node, _decorator, Vec2, Size, instantiate, UITransform, Rect, Component, Toggle, SpriteFrame, Label, Sprite, math, Canvas, error, Color, Button, UIOpacity, Tween, director, NodeEventType, EventTouch, CCFloat, CCInteger, Vec3 } from "cc";
const { ccclass, property, disallowMultiple } = _decorator;

@ccclass("DropdownItem")
@disallowMultiple()
export class DropdownItem extends Component {
    @property(Label)
        text: Label|null = null;

    @property(Sprite)
        image: Sprite|null = null;

    @property(Toggle)
        toggle: Toggle|null = null;

    @property(UITransform)
        rectTransform: UITransform|null = null;

    protected onEnable(): void {
        super.onEnable?.();
    }

    protected onDisable(): void {
        super.onDisable?.();
    }
}
