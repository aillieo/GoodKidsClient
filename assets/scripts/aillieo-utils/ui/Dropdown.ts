import { Node, _decorator, Vec2, Size, instantiate, UITransform, Rect, Component, Toggle, SpriteFrame, Label, Sprite, math, Canvas, error, Color, Button, UIOpacity, Tween, director, NodeEventType, EventTouch, CCFloat, CCInteger, Vec3, EventHandler, EventMouse, CCString } from "cc";
import { DropdownItem } from "./DropdownItem";
const { ccclass, property, disallowMultiple, menu } = _decorator;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = unknown> = new (...args: any[]) => T;

export interface OptionData {
    text: string | null;
    image: SpriteFrame | null;
}

@ccclass("OptionData")
class SOptionData implements OptionData {
    @property(CCString)
    public text: string | null = "";

    @property(SpriteFrame)
    public image: SpriteFrame | null = null;
}

@ccclass("Dropdown")
@menu("UI/Dropdown")
@disallowMultiple()
export class Dropdown extends Component {
    @property({ serializable: true, visible: true, type: UITransform })
    private _template: UITransform | null = null;

    public get template(): UITransform {
        return this._template!;
    }

    public set template(value: UITransform) {
        this._template = value;
        this.refreshShownValue();
    }

    @property({ serializable: true, visible: true, type: Label })
    private _captionText: Label | null = null;

    public get captionText(): Label {
        return this._captionText!;
    }

    public set captionText(value: Label) {
        this._captionText = value;
        this.refreshShownValue();
    }

    @property({ serializable: true, visible: true, type: Sprite })
    private _captionImage: Sprite | null = null;

    public get captionImage(): Sprite {
        return this._captionImage!;
    }

    public set captionImage(value: Sprite) {
        this._captionImage = value;
        this.refreshShownValue();
    }

    @property({ serializable: true, visible: true, type: Label })
    private _itemText: Label | null = null;

    public get itemText(): Label {
        return this._itemText!;
    }

    public set itemText(value: Label) {
        this._itemText = value;
        this.refreshShownValue();
    }

    @property({ serializable: true, visible: true, type: Sprite })
    private _itemImage: Sprite | null = null;

    public get itemImage(): Sprite {
        return this._itemImage!;
    }

    public set itemImage(value: Sprite) {
        this._itemImage = value;
        this.refreshShownValue();
    }

    @property({ serializable: true, visible: true, type: CCInteger })
    private _value: number = 0;

    @property({ serializable: true, visible: true, type: [SOptionData] })
    private _options: SOptionData[] = [];

    public get options(): OptionData[] {
        return this._options;
    }

    public set options(value: OptionData[]) {
        this._options = value;
        this.refreshShownValue();
    }

    @property({ serializable: true, visible: true, type: [EventHandler] })
    private _onValueChanged: EventHandler[] = [];

    @property({ serializable: true, visible: true, type: CCFloat })
    private _alphaFadeSpeed: number = 0.15;

    public get alphaFadeSpeed(): number {
        return this._alphaFadeSpeed;
    }

    public set alphaFadeSpeed(value: number) {
        this._alphaFadeSpeed = value;
    }

    @property({ serializable: true, visible: true })
    protected _interactable: boolean = true;

    get interactable(): boolean {
        return this._interactable;
    }

    set interactable(value) {
        if (this._interactable === value) {
            return;
        }

        this._interactable = value;
        this.refreshShownValue();

        if (!this._interactable) {
            this.refreshShownValue();
        }
    }

    private _dropdown: Node | null = null;
    private _blocker: Node | null = null;
    private _items: DropdownItem[] = [];
    private alphaTween: Tween<UIOpacity> | null = null;
    private validTemplate: boolean = false;
    private static kHighSortingLayer: number = 30000;
    private static s_NoOptionData: OptionData = { text: null, image: null };

    private _pressed: boolean = false;

    public get value(): number {
        return this._value;
    }

    public set value(value: number) {
        this.set(value);
    }

    public setValueWithoutNotify(input: number): void {
        this.set(input, false);
    }

    private set(value: number, sendCallback: boolean = true): void {
        if (value === this._value || this.options.length === 0) {
            return;
        }

        this._value = math.clamp(value, 0, this.options.length - 1);
        this.refreshShownValue();

        if (sendCallback) {
            this._onValueChanged.forEach(e => e.emit([this._value]));
        }
    }

    protected _registerEvent(): void {
        this.node.on(NodeEventType.TOUCH_START, this._onTouchBegan, this, true);
        this.node.on(NodeEventType.TOUCH_MOVE, this._onTouchMoved, this, true);
        this.node.on(NodeEventType.TOUCH_END, this._onTouchEnded, this, true);
        this.node.on(NodeEventType.TOUCH_CANCEL, this._onTouchCancelled, this, true);
        this.node.on(NodeEventType.MOUSE_WHEEL, this._onMouseWheel, this, true);
    }

    protected _unregisterEvent(): void {
        this.node.off(NodeEventType.TOUCH_START, this._onTouchBegan, this, true);
        this.node.off(NodeEventType.TOUCH_MOVE, this._onTouchMoved, this, true);
        this.node.off(NodeEventType.TOUCH_END, this._onTouchEnded, this, true);
        this.node.off(NodeEventType.TOUCH_CANCEL, this._onTouchCancelled, this, true);
        this.node.off(NodeEventType.MOUSE_WHEEL, this._onMouseWheel, this, true);
    }

    protected _onTouchBegan(event?: EventTouch): void {
        if (!this._interactable || !this.enabledInHierarchy) {
            return;
        }

        this._pressed = true;
        if (event) {
            // event.propagationStopped = true;
        }
    }

    protected _onTouchMoved(event?: EventTouch): void {
        if (!this._interactable || !this.enabledInHierarchy || !this._pressed) {
            return;
        }

        if (!event) {
            return;
        }

        const touch = (event).touch;
        if (!touch) {
            return;
        }

        if (this._pressed) {
            const hit = this.node.getComponent(UITransform)!.hitTest(touch.getLocation(), event.windowId);
            if (!hit) {
                this._pressed = false;
            }
        }

        if (event) {
            // event.propagationStopped = true;
        }
    }

    protected _onTouchEnded(event?: EventTouch): void {
        if (!this._interactable || !this.enabledInHierarchy) {
            return;
        }

        if (this._pressed) {
            this.onPointerClick(event!);
        }

        this._pressed = false;

        if (event) {
            // event.propagationStopped = true;
        }
    }

    protected _onTouchCancelled(event?: EventTouch): void {
        if (!this._interactable || !this.enabledInHierarchy) {
            return;
        }

        this._pressed = false;
    }

    protected _onMouseWheel(event: EventMouse): void {

    }

    protected override onLoad(): void {
        super.onLoad?.();

        this.alphaTween = null;

        if (this._captionImage) { this._captionImage.enabled = this._captionImage.spriteFrame != null; }

        if (this._template) { this._template.node.active = false; }
    }

    protected override start(): void {
        this.alphaTween = null;

        super.start?.();

        this.refreshShownValue();
    }

    protected override onEnable(): void {
        super.onEnable?.();
        this._registerEvent();
    }

    protected override onDisable(): void {
        this._unregisterEvent();

        this.immediateDestroyDropdownList();

        if (this._blocker != null) {
            this.destroyBlocker(this._blocker);
        }
        this._blocker = null;

        super.onDisable?.();
    }

    public refreshShownValue(): void {
        let data: OptionData = Dropdown.s_NoOptionData;

        if (this.options.length > 0) { data = this.options[math.clamp(this._value, 0, this.options.length - 1)]; }

        if (this._captionText) {
            if (data != null && data.text != null) {
                this._captionText.string = data.text;
            } else {
                this._captionText.string = "";
            }
        }

        if (this._captionImage) {
            if (data != null) {
                this._captionImage.spriteFrame = data.image;
            } else {
                this._captionImage.spriteFrame = null;
            }
            this._captionImage.enabled = this._captionImage.spriteFrame != null;
        }
    }

    public addOptions(...options: Array<OptionData | string | SpriteFrame>): void {
        for (let i = 0; i < options.length; i++) {
            const option = options[i];
            if (typeof option === "string") {
                this.options.push({ text: option, image: null });
            } else if (option instanceof SpriteFrame) {
                this.options.push({ image: option, text: null });
            } else {
                this.options.push(option);
            }
        }
        this.refreshShownValue();
    }

    public clearOptions(): void {
        this.options = [];
        this._value = 0;
        this.refreshShownValue();
    }

    private setupTemplate(rootCanvas: Canvas): void {
        this.validTemplate = false;

        if (!this._template) {
            error(
                "The dropdown template is not assigned. The template needs to be assigned and must have a child Node with a Toggle component serving as the item.",
                this
            );
            return;
        }

        const templateGo: Node = this._template.node;
        templateGo.active = true;
        const itemToggle: Toggle | null = this._template.getComponentInChildren(Toggle);

        this.validTemplate = true;

        if (!itemToggle || itemToggle.node === this.template.node) {
            this.validTemplate = false;
            error(
                "The dropdown template is not valid. The template must have a child Node with a Toggle component serving as the item.",
                this.template
            );
        } else if (itemToggle.node.parent?.getComponent(UITransform) == null) {
            this.validTemplate = false;
            error(
                "The dropdown template is not valid. The child Node with a Toggle component (the item) must have a UITransform on its parent.",
                this.template
            );
        } else if (this.itemText != null && !this.itemText.node.isChildOf(itemToggle.node)) {
            this.validTemplate = false;
            error(
                "The dropdown template is not valid. The Item Label must be on the item Node or children of it.",
                this.template
            );
        } else if (this.itemImage != null && !this.itemImage.node.isChildOf(itemToggle.node)) {
            this.validTemplate = false;
            error(
                "The dropdown template is not valid. The Item Sprite must be on the item Node or children of it.",
                this.template
            );
        }

        if (!this.validTemplate) {
            templateGo.active = false;
            return;
        }

        const item: DropdownItem = Dropdown.getOrAddComponent(itemToggle!.node, DropdownItem);
        item.text = this._itemText;
        item.image = this._itemImage;
        item.toggle = itemToggle;
        item.rectTransform = itemToggle!.node.getComponent(UITransform);

        Dropdown.getOrAddComponent(templateGo, UIOpacity);
        templateGo.active = false;

        this.validTemplate = true;
    }

    private static getOrAddComponent<T extends Component>(go: Node, ctor: Constructor<T>): T {
        let comp: T | null = go.getComponent(ctor);
        if (!comp) {
            comp = go.addComponent(ctor);
        }
        return comp;
    }

    public onPointerClick(eventData: EventTouch): void {
        this.show();
    }

    public show(): void {
        if (!this.enabledInHierarchy || !this._interactable || this._dropdown != null) return;

        const rootCanvas: Canvas = director.getScene()!.getChildByName("Canvas")!.getComponent(Canvas)!;
        if (!this.validTemplate) {
            this.setupTemplate(rootCanvas);
            if (!this.validTemplate) return;
        }

        this._template!.node.active = true;

        // Instantiate the drop-down template
        this._dropdown = this.createDropdownList(this._template!.node);
        this._dropdown.name = "Dropdown Array";
        this._dropdown.active = true;

        // Make drop-down UITransform have the same values as the original.
        const dropdownRectTransform: UITransform = this._dropdown!.getComponent(UITransform)!;
        dropdownRectTransform.node.setParent(this._template!.node.parent, false);

        // Instantiate the drop-down list items

        // Find the dropdown item and disable it.
        const itemTemplate: DropdownItem = this._dropdown.getComponentInChildren(DropdownItem)!;

        const content: Node = itemTemplate.rectTransform!.node.parent!;
        const contentRectTransform: UITransform = content.getComponent(UITransform)!;
        itemTemplate.rectTransform!.node.active = true;

        // Get the rects of the dropdown and item
        const dropdownContentRect: Rect = contentRectTransform.getBoundingBox();
        const itemTemplateRect: Rect = itemTemplate.rectTransform!.getBoundingBox();

        // Calculate the visual offset between the item's edges and the background's edges
        const offsetMin: Vec2 = new Vec2(
            itemTemplateRect.xMin - dropdownContentRect.xMin + itemTemplate.node!.position.x,
            itemTemplateRect.yMin - dropdownContentRect.yMin + itemTemplate.node!.position.y);
        const offsetMax: Vec2 = new Vec2(
            itemTemplateRect.xMax - dropdownContentRect.xMax + itemTemplate.node.position.x,
            itemTemplateRect.yMax - dropdownContentRect.yMax + itemTemplate.node.position.y);
        const itemSize: Size = itemTemplateRect.size;

        this._items = [];

        for (let i = 0; i < this.options.length; ++i) {
            const data: OptionData = this.options[i];
            const item: DropdownItem = this.addItem(data, this.value === i, itemTemplate, this._items);
            if (item == null) continue;

            // Automatically set up a toggle state change listener
            item.toggle!.isChecked = this.value === i;
            item.toggle!.node.on("toggle", (x: boolean) => this.onSelectItem(item.toggle!));

            // Select current option
            if (item.toggle!.isChecked) {
                item.toggle!.setIsCheckedWithoutNotify(true);
            }
        }

        // Reposition all items now that all of them have been added
        const sizeDelta: Size = new Size(contentRectTransform.width, contentRectTransform.height);
        sizeDelta.y = itemSize.y * this._items.length + offsetMin.y - offsetMax.y;
        // sizeDelta.y = itemSize.y * this._items.length;
        contentRectTransform.contentSize = sizeDelta;

        const extraSpace: number = dropdownRectTransform.contentSize.height - contentRectTransform.contentSize.height;
        if (extraSpace > 0) { dropdownRectTransform.contentSize = new Size(dropdownRectTransform.contentSize.x, dropdownRectTransform.contentSize.y - extraSpace); }

        // Invert anchoring and position if the dropdown is partially or fully outside of the canvas rect.
        // Typically this will have the effect of placing the dropdown above the button instead of below,
        // but it works as inversion regardless of the initial setup.
        // const corners: Vec3[] = new Array<Vec3>(4);
        // dropdownRectTransform.GetWorldCorners(corners);

        // const dropdownRectBounds : Rect = dropdownRectTransform.getBoundingBox();
        // const dropdownRectBoundsWorld = dropdownRectBounds.transformMat4(dropdownRectTransform!.node.worldMatrix);

        // const rootCanvasRectTransform: UITransform = rootCanvas.node.getComponent(UITransform)!;
        // const rootCanvasRect: Rect = rootCanvasRectTransform.getBoundingBox();
        for (let axis = 0; axis < 2; axis++) {
            // let outside: boolean = false;
            // for (let i = 0; i < 4; i++) {
            //     const corner: Vec3 = rootCanvasRectTransform.InverseTransformPoint(corners[i]);
            //     if (
            //         (corner[axis] < rootCanvasRect.min[axis] && !Mathf.Approximately(corner[axis], rootCanvasRect.min[axis])) ||
            //   (corner[axis] > rootCanvasRect.max[axis] && !Mathf.Approximately(corner[axis], rootCanvasRect.max[axis]))
            //     ) {
            //         outside = true;
            //         break;
            //     }
            // }
            // if (outside) RectTransformUtility.FlipLayoutOnAxis(dropdownRectTransform, axis, false, false);
        }

        let positionY: number = 0;
        for (let i = 0; i < this._items.length; i++) {
            const item: DropdownItem = this._items[i];
            const itemRect: UITransform = item.rectTransform!;
            itemRect.contentSize = new Size(itemRect.contentSize.x, itemSize.y);
            const position = new Vec3();
            item.node.getPosition(position);
            positionY -= itemSize.y;
            position.y = positionY;
            item.node.setPosition(position);
        }

        // Fade in the popup
        this.alphaFadeList(this._alphaFadeSpeed, 0, 1);

        // Make drop-down template and item template inactive
        this._template!.node.active = false;
        itemTemplate.node.active = false;

        this._blocker = this.createBlocker(rootCanvas);
    }

    protected createBlocker(rootCanvas: Canvas): Node {
        // Create blocker Node.
        const blocker: Node = new Node("Blocker");

        // Setup blocker UITransform to cover entire root canvas area.
        const blockerRect: UITransform = blocker.addComponent(UITransform);
        // blockerRect.node.setParent(rootCanvas.node, false);
        blockerRect.node.setParent(this.node, false);
        blockerRect.node.setSiblingIndex(0);
        blockerRect.contentSize = Size.ZERO;
        blockerRect.contentSize = new Size(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);

        // Add image since it's needed to block, but make it clear.
        const blockerImage: Sprite = blocker.addComponent(Sprite);
        blockerImage.color = Color.TRANSPARENT;

        // Add button since it's needed to block, and to close the dropdown when blocking area is clicked.
        const blockerButton: Button = blocker.addComponent(Button);
        blockerButton.node.on(Button.EventType.CLICK, this.hide, this);

        return blocker;
    }

    protected destroyBlocker(blocker: Node): void {
        blocker.destroy();
    }

    protected createDropdownList(template: Node): Node {
        return instantiate(template);
    }

    protected destroyDropdownList(dropdownList: Node): void {
        dropdownList.destroy();
    }

    protected createItem(itemTemplate: DropdownItem): DropdownItem {
        const newNode = instantiate(itemTemplate.node);
        return Dropdown.getOrAddComponent(newNode, DropdownItem);
    }

    protected destroyItem(item: DropdownItem): void {

    }

    // Add a new drop-down list item with the specified values.
    private addItem(
        data: OptionData,
        selected: boolean,
        itemTemplate: DropdownItem,
        items: DropdownItem[]
    ): DropdownItem {
        // Add a new item to the dropdown.
        const item: DropdownItem = this.createItem(itemTemplate);
        item.rectTransform!.node.setParent(itemTemplate.rectTransform!.node.parent, false);

        item.node.active = true;
        item.node.name = "Item " + items.length + (data.text != null ? ": " + data.text : "");

        if (item.toggle != null) {
            item.toggle.isChecked = false;
        }

        // Set the item's data
        if (item.text != null) {
            item.text.string = data.text!;
        }

        if (item.image) {
            item.image.spriteFrame = data.image;
            item.image.enabled = item.image.spriteFrame != null;
        }

        items.push(item);
        return item;
    }

    private alphaFadeList(duration: number, alpha: number): void;
    private alphaFadeList(duration: number, alphaStart: number, alpha: number): void;
    private alphaFadeList(duration: number, alphaStartOrAlpha: number, alpha?: number): void {
        const group: UIOpacity = this._dropdown!.getComponent(UIOpacity)!;

        let alphaStart: number;
        if (alpha === undefined) {
            alpha = alphaStartOrAlpha;
            alphaStart = group.opacity / 255;
        } else {
            alphaStart = alphaStartOrAlpha;
        }

        if (alpha === alphaStart) return;

        this.setAlpha(alphaStart);
        const tween: Tween<UIOpacity> = new Tween(group);
        tween.to(duration, { opacity: alpha * 255 }).start();

        this.alphaTween = tween;
    }

    private setAlpha(alpha: number): void {
        if (!this._dropdown) return;
        const group: UIOpacity = this._dropdown.getComponent(UIOpacity)!;
        group.opacity = alpha * 255;
    }

    public hide(): void {
        if (this._dropdown != null) {
            this.alphaFadeList(this._alphaFadeSpeed, 0);
            // User could have disabled the dropdown during the OnValueChanged call.
            if (this.node.active && this.enabledInHierarchy) {
                this.delayedDestroyDropdownList(this._alphaFadeSpeed);
            }
        }
        if (this._blocker != null) this.destroyBlocker(this._blocker);
        this._blocker = null;
        // this.Select();
    }

    private async delayedDestroyDropdownList(delay: number) {
        await new Promise<void>((resolve) => {
            this.scheduleOnce(() => {
                resolve();
            }, delay);
        });

        this.immediateDestroyDropdownList();
    }

    private immediateDestroyDropdownList(): void {
        for (let i = 0; i < this._items.length; i++) {
            if (this._items[i] != null) {
                this.destroyItem(this._items[i]);
            }
        }
        this._items.length = 0;

        if (this._dropdown != null) {
            this.destroyDropdownList(this._dropdown);
        }

        this._dropdown = null;
    }

    // Change the value and hide the dropdown.
    private onSelectItem(toggle: Toggle): void {
        if (!toggle.isChecked) toggle.isChecked = true;

        let selectedIndex = -1;
        const tr: Node = toggle.node;
        const parent: Node = tr.parent!;
        for (let i = 0; i < parent.children.length; i++) {
            if (parent.children[i] === tr) {
                // Subtract one to account for template child.
                selectedIndex = i - 1;
                break;
            }
        }

        console.log("selectedIndex " + selectedIndex + " " + this.options[selectedIndex].text);

        if (selectedIndex < 0) return;

        this.value = selectedIndex;
        this.hide();
    }
}
