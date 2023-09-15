import { mat4, type Node, Enum, _decorator, ScrollView, Prefab, Vec2, Size, NodePool, instantiate, Vec3, UITransform, Rect, clamp } from "cc";
const { ccclass, property, disallowMultiple, menu } = _decorator;

// for hide and show
enum ItemLayoutType {
    // 最后一位表示滚动方向
    Vertical = 0b0001, // 0001
    Horizontal = 0b0010, // 0010
    VerticalThenHorizontal = 0b0100, // 0100
    HorizontalThenVertical = 0b0101, // 0101
}

enum CriticalItemType {
    UpToHide = 0,
    DownToHide = 1,
    UpToShow = 2,
    DownToShow = 3,
}

Enum(CriticalItemType);

class ScrollItemWithRect {
    // scroll item 身上的 RectTransform组件
    public item: UITransform|null = null;

    // scroll item 在scrollview中的位置
    public rect: Rect = new Rect(0, 0, 0, 0);

    // rect 是否需要更新
    public rectDirty: boolean = true;
}

@ccclass
@disallowMultiple()
@menu("DynamicScrollView")
export class DynamicScrollView extends ScrollView {
    @property({
        type: Size,
        tooltip: "默认item尺寸"
    })
    public defaultItemSize: Size = new Size(100, 100);

    @property({
        type: Prefab,
        tooltip: "item的模板"
    })
    public itemTemplate: Prefab|null = null;

    // 0001
    protected static readonly flagScrollDirection: number = 1;

    @property({
        type: Enum(ItemLayoutType)
    })
    protected layoutType: ItemLayoutType = ItemLayoutType.Vertical;

    // 只保存4个临界index
    protected criticalItemIndex: number[] = new Array<number>(4);

    // callbacks for items
    protected updateFunc: ((index: number, item: UITransform) => void)|null = null;
    protected itemSizeFunc: ((index: number) => Size)|null = null;
    protected itemCountFunc: (() => number)|null = null;
    protected itemGetFunc: ((index: number) => UITransform)|null = null;
    protected itemRecycleFunc: ((item: UITransform) => void)|null = null;

    private readonly managedItems: ScrollItemWithRect[] = new Array<ScrollItemWithRect>(0);

    private refRect: Rect = new Rect(0, 0, 0, 0);

    // resource management
    private itemPool: NodePool|null = null;

    private dataCount: number = 0;

    // status
    private initialized: boolean = false;
    private willUpdateData: number = 0;

    public SetUpdateFunc(func: ((index: number, item: UITransform) => void)|null): void {
        this.updateFunc = func;
    }

    public SetItemSizeFunc(func: ((index: number) => Size)|null): void {
        this.itemSizeFunc = func;
    }

    public SetItemCountFunc(func:(() => number)|null): void {
        this.itemCountFunc = func;
    }

    public SetItemGetAndRecycleFunc(getFunc:((index: number) => UITransform)|null, recycleFunc: ((item: UITransform) => void)|null): void {
        if (getFunc != null && recycleFunc != null) {
            this.itemGetFunc = getFunc;
            this.itemRecycleFunc = recycleFunc;
        } else {
            this.itemGetFunc = null;
            this.itemRecycleFunc = null;
        }
    }

    public ResetAllDelegates(): void {
        this.SetUpdateFunc(null);
        this.SetItemSizeFunc(null);
        this.SetItemCountFunc(null);
        this.SetItemGetAndRecycleFunc(null, null);
    }

    public UpdateData(immediately: boolean = true): void {
        if (immediately) {
            this.willUpdateData |= 3; // 0011
            this.InternalUpdateData();
        } else {
            if (this.willUpdateData === 0 && this.IsActive()) {
                this.scheduleOnce(() => {
                    this.InternalUpdateData();
                }, 0);
            }

            this.willUpdateData |= 3;
        }
    }

    public UpdateDataIncrementally(immediately: boolean = true): void {
        if (immediately) {
            this.willUpdateData |= 1; // 0001
            this.InternalUpdateData();
        } else {
            if (this.willUpdateData === 0) {
                this.scheduleOnce(() => {
                    this.InternalUpdateData();
                }, 0);
            }

            this.willUpdateData |= 1;
        }
    }

    public ScrollToIndex(index: number): void {
        this.InternalScrollTo(index);
    }

    public override onEnable(): void {
        super.onEnable();
        if (this.willUpdateData !== 0) {
            this.scheduleOnce(() => {
                this.InternalUpdateData();
            }, 0);
        }
    }

    public override onDisable(): void {
        this.initialized = false;
        super.onDisable();
    }

    protected InternalScrollTo(index: number): void {
        index = clamp(index, 0, this.dataCount - 1);
        this.EnsureItemRect(index);
        const r: Rect = this.managedItems[index].rect;
        const dir = this.layoutType & DynamicScrollView.flagScrollDirection;
        const contentTrans: UITransform = this.content!.getComponent(UITransform)!;
        if (dir === 1) {
            // vertical
            const value = 1 - (-r.yMax / (contentTrans!.height - this.refRect.height));
            this.scrollToPercentVertical(value);
        } else {
            // horizontal
            const value = r.xMin / (contentTrans!.width - this.refRect.width);
            this.scrollToPercentHorizontal(value);
        }
    }

    public override scrollToOffset(offset: Vec2, timeInSecond?: number, attenuated?: boolean): void {
        super.scrollToOffset(offset, timeInSecond, attenuated);
        this.UpdateCriticalItems();
    }

    public override scrollToPercentHorizontal(percent: number, timeInSecond?: number, attenuated?: boolean): void {
        super.scrollToPercentHorizontal(percent, timeInSecond || 0, attenuated || false);
        this.ResetCriticalItems();
    }

    public override scrollToPercentVertical(percent: number, timeInSecond?: number, attenuated?: boolean): void {
        super.scrollToPercentVertical(percent, timeInSecond, attenuated);
        this.ResetCriticalItems();
    }

    protected override _moveContent(deltaMove: Vec3, canStartBounceBack?: boolean): void {
        super._moveContent(deltaMove, canStartBounceBack);
        this.UpdateRefRect();
        this.UpdateCriticalItems();
    }

    protected EnsureItemRect(index: number): void {
        if (!this.managedItems[index].rectDirty) {
            // 已经是干净的了
            return;
        }

        const firstItem: ScrollItemWithRect = this.managedItems[0];
        if (firstItem.rectDirty) {
            const firstSize: Size = this.GetItemSize(0);
            firstItem.rect = DynamicScrollView.CreateWithLeftTopAndSize(Vec2.ZERO, firstSize);
            firstItem.rectDirty = false;
        }

        // 当前item之前的最近的已更新的rect
        let nearestClean: number = 0;
        for (let i: number = index; i >= 0; --i) {
            if (!this.managedItems[i].rectDirty) {
                nearestClean = i;
                break;
            }
        }

        // 需要更新 从 nearestClean 到 index 的尺寸
        const nearestCleanRect: Rect = this.managedItems[nearestClean].rect;
        let curPos: Vec2 = DynamicScrollView.GetLeftTop(nearestCleanRect);
        let size: Size = nearestCleanRect.size;
        curPos = this.MovePos(curPos, size);

        for (let i: number = nearestClean + 1; i <= index; i++) {
            size = this.GetItemSize(i);
            this.managedItems[i].rect = DynamicScrollView.CreateWithLeftTopAndSize(curPos, size);
            this.managedItems[i].rectDirty = false;
            curPos = this.MovePos(curPos, size);
        }

        const range = new Size(Math.abs(curPos.x), Math.abs(curPos.y));
        switch (this.layoutType) {
            case ItemLayoutType.Vertical:
                range.x = this.refRect.width;
                break;
            case ItemLayoutType.Horizontal:
                range.y = this.refRect.height;
                break;
            case ItemLayoutType.VerticalThenHorizontal:
                range.x += size.x;
                range.y = this.refRect.height;
                break;
            case ItemLayoutType.HorizontalThenVertical:
                range.x = this.refRect.width;
                if (curPos.x !== 0) {
                    range.y += size.y;
                }

                break;
            default:
                break;
        }

        const contentTrans: UITransform = this.content!.getComponent(UITransform)!;
        contentTrans.setContentSize(range);
    }

    protected override onDestroy(): void {
        if (this.itemPool != null) {
            this.itemPool.clear();
        }

        super.onDestroy?.();
    }

    protected GetItemLocalRect(index: number): Rect {
        if (index >= 0 && index < this.dataCount) {
            this.EnsureItemRect(index);
            return this.managedItems[index].rect;
        }

        return new Rect();
    }

    private static GetLeftTop(rect: Rect): Vec2 {
        const ret: Vec2 = rect.origin;
        ret.y += rect.size.y;
        return ret;
    }

    private static CreateWithLeftTopAndSize(leftTop: Vec2, size: Size): Rect {
        return new Rect(leftTop.x, leftTop.y - size.height, size.width, size.height);
    }

    private InternalUpdateData(): void {
        if (!this.IsActive()) {
            this.willUpdateData |= 3;
            return;
        }

        if (!this.initialized) {
            this.InitScrollView();
        }

        let newDataCount = 0;
        const keepOldItems = (this.willUpdateData & 2) === 0;

        if (this.itemCountFunc != null) {
            newDataCount = this.itemCountFunc();
        }

        if (newDataCount !== this.managedItems.length) {
            if (this.managedItems.length < newDataCount) {
                // 增加
                if (!keepOldItems) {
                    for (const itemWithRect of this.managedItems) {
                        // 重置所有rect
                        itemWithRect.rectDirty = true;
                    }
                }

                while (this.managedItems.length < newDataCount) {
                    this.managedItems.push(new ScrollItemWithRect());
                }
            } else {
                // 减少 保留空位 避免GC
                for (let i: number = 0, count = this.managedItems.length; i < count; ++i) {
                    if (i < newDataCount) {
                        // 重置所有rect
                        if (!keepOldItems) {
                            this.managedItems[i].rectDirty = true;
                        }

                        if (i === newDataCount - 1) {
                            this.managedItems[i].rectDirty = true;
                        }
                    }

                    // 超出部分 清理回收item
                    if (i >= newDataCount) {
                        this.managedItems[i].rectDirty = true;
                        if (this.managedItems[i].item != null) {
                            this.RecycleOldItem(this.managedItems[i].item!);
                            this.managedItems[i].item = null;
                        }
                    }
                }
            }
        } else {
            if (!keepOldItems) {
                for (let i = 0, count = this.managedItems.length; i < count; ++i) {
                    // 重置所有rect
                    this.managedItems[i].rectDirty = true;
                }
            }
        }

        this.dataCount = newDataCount;

        this.ResetCriticalItems();

        this.willUpdateData = 0;
    }

    private ResetCriticalItems(): void {
        let hasItem: boolean;
        let shouldShow: boolean;
        let firstIndex: number = -1;
        let lastIndex: number = -1;

        for (let i = 0; i < this.dataCount; i++) {
            hasItem = this.managedItems[i].item != null;
            shouldShow = this.ShouldItemSeenAtIndex(i);

            if (shouldShow) {
                if (firstIndex === -1) {
                    firstIndex = i;
                }

                lastIndex = i;
            }

            if (hasItem && shouldShow) {
                // 应显示且已显示
                this.SetDataForItemAtIndex(this.managedItems[i].item!, i);
                continue;
            }

            if (hasItem === shouldShow) {
                // 不应显示且未显示
                // if (firstIndex != -1)
                // {
                //     // 已经遍历完所有要显示的了 后边的先跳过
                //     break;
                // }
                continue;
            }

            if (hasItem && !shouldShow) {
                // 不该显示 但是有
                this.RecycleOldItem(this.managedItems[i].item!);
                this.managedItems[i].item = null;
                continue;
            }

            if (shouldShow && !hasItem) {
                // 需要显示 但是没有
                const item: UITransform = this.GetNewItem(i);
                this.OnGetItemForDataIndex(item, i);
                this.managedItems[i].item = item;
                continue;
            }
        }

        // content.localPosition = Vector2.zero;
        this.criticalItemIndex[CriticalItemType.UpToHide] = firstIndex;
        this.criticalItemIndex[CriticalItemType.DownToHide] = lastIndex;
        this.criticalItemIndex[CriticalItemType.UpToShow] = Math.max(firstIndex - 1, 0);
        this.criticalItemIndex[CriticalItemType.DownToShow] = Math.min(lastIndex + 1, this.dataCount - 1);
    }

    private GetCriticalItem(type: number): UITransform|null {
        const index = this.criticalItemIndex[type];
        if (index >= 0 && index < this.dataCount) {
            return this.managedItems[index].item!;
        }

        // throw Error(`index out of range  ${index} of ${this.dataCount}`);
        return null;
    }

    private UpdateCriticalItems(): void {
        let dirty = true;

        while (dirty) {
            dirty = false;

            for (let i = CriticalItemType.UpToHide; i <= CriticalItemType.DownToShow; i++) {
                if (i <= CriticalItemType.DownToHide) {
                    // 隐藏离开可见区域的item
                    dirty = dirty || this.CheckAndHideItem(i);
                } else {
                    // 显示进入可见区域的item
                    dirty = dirty || this.CheckAndShowItem(i);
                }
            }
        }
    }

    private CheckAndHideItem(criticalItemType: number): boolean {
        const item: UITransform|null = this.GetCriticalItem(criticalItemType);
        const criticalIndex = this.criticalItemIndex[criticalItemType];
        if (item != null && !this.ShouldItemSeenAtIndex(criticalIndex)) {
            this.RecycleOldItem(item);
            this.managedItems[criticalIndex].item = null;

            if (criticalItemType === CriticalItemType.UpToHide) {
                // 最上隐藏了一个
                this.criticalItemIndex[criticalItemType + 2] = Math.max(criticalIndex, this.criticalItemIndex[criticalItemType + 2]);
                this.criticalItemIndex[criticalItemType]++;
            } else {
                // 最下隐藏了一个
                this.criticalItemIndex[criticalItemType + 2] = Math.min(criticalIndex, this.criticalItemIndex[criticalItemType + 2]);
                this.criticalItemIndex[criticalItemType]--;
            }

            this.criticalItemIndex[criticalItemType] = clamp(this.criticalItemIndex[criticalItemType], 0, this.dataCount - 1);

            if (this.criticalItemIndex[CriticalItemType.UpToHide] > this.criticalItemIndex[CriticalItemType.DownToHide]) {
                // 偶然的情况 拖拽超出一屏
                this.ResetCriticalItems();
                return false;
            }

            return true;
        }

        return false;
    }

    private CheckAndShowItem(criticalItemType: number): boolean {
        const item: UITransform|null = this.GetCriticalItem(criticalItemType);
        const criticalIndex = this.criticalItemIndex[criticalItemType];

        if (item == null && this.ShouldItemSeenAtIndex(criticalIndex)) {
            const newItem: UITransform = this.GetNewItem(criticalIndex);
            this.OnGetItemForDataIndex(newItem, criticalIndex);
            this.managedItems[criticalIndex].item = newItem;

            if (criticalItemType === CriticalItemType.UpToShow) {
                // 最上显示了一个
                this.criticalItemIndex[criticalItemType - 2] = Math.min(criticalIndex, this.criticalItemIndex[criticalItemType - 2]);
                this.criticalItemIndex[criticalItemType]--;
            } else {
                // 最下显示了一个
                this.criticalItemIndex[criticalItemType - 2] = Math.max(criticalIndex, this.criticalItemIndex[criticalItemType - 2]);
                this.criticalItemIndex[criticalItemType]++;
            }

            this.criticalItemIndex[criticalItemType] = clamp(this.criticalItemIndex[criticalItemType], 0, this.dataCount - 1);

            if (this.criticalItemIndex[CriticalItemType.UpToShow] >= this.criticalItemIndex[CriticalItemType.DownToShow]) {
                // 偶然的情况 拖拽超出一屏
                this.ResetCriticalItems();
                return false;
            }

            return true;
        }

        return false;
    }

    private ShouldItemSeenAtIndex(index: number): boolean {
        if (index < 0 || index >= this.dataCount) {
            return false;
        }

        this.EnsureItemRect(index);
        return this.refRect.intersects(this.managedItems[index].rect);
    }

    private InitPool(): void {
        this.itemPool = new NodePool();
    }

    private OnGetItemForDataIndex(item: UITransform, index: number): void {
        this.SetDataForItemAtIndex(item, index);
        item.node.setParent(this.content, false);
    }

    private SetDataForItemAtIndex(item: UITransform, index: number): void {
        if (this.updateFunc != null) {
            this.updateFunc(index, item);
        }

        this.SetPosForItemAtIndex(item, index);
    }

    private SetPosForItemAtIndex(item: UITransform, index: number): void {
        this.EnsureItemRect(index);
        const r: Rect = this.managedItems[index].rect;
        item.node.position = new Vec3(r.center.x, r.center.y, 0);
        item.setContentSize(r.size);
    }

    private GetItemSize(index: number): Size {
        if (index >= 0 && index <= this.dataCount) {
            if (this.itemSizeFunc != null) {
                return this.itemSizeFunc(index);
            }
        }

        return this.defaultItemSize;
    }

    private GetNewItem(index: number): UITransform {
        let item: UITransform;
        if (this.itemGetFunc != null) {
            item = this.itemGetFunc(index);
        } else {
            let node: Node;
            if (this.itemPool!.size() > 0) {
                node = this.itemPool!.get()!;
            } else {
                node = instantiate(this.itemTemplate!);
            }

            node.active = true;
            item = node.getComponent(UITransform)!;
            node.setParent(this.content, false);
        }

        return item;
    }

    private RecycleOldItem(item: UITransform): void {
        if (this.itemRecycleFunc != null) {
            this.itemRecycleFunc(item);
        } else {
            item.node.active = false;
            this.itemPool!.put(item.node);
            item.node.name = "";
        }
    }

    private InitScrollView(): void {
        this.initialized = true;

        // 根据设置来控制原ScrollRect的滚动方向
        const dir = this.layoutType & DynamicScrollView.flagScrollDirection;
        this.vertical = dir === 1;
        this.horizontal = dir === 0;

        const contentTrans = this.content!.getComponent(UITransform)!;
        contentTrans.anchorPoint = new Vec2(0, 1);
        this.content!.setPosition(0, 0);

        this.InitPool();
        this.UpdateRefRect();
    }

    // refRect是在Content节点下的 viewport的 rect
    private UpdateRefRect(): void {
        /*
            *  WorldCorners
            *
            *    1 ------- 2
            *    |         |
            *    |         |
            *    0 ------- 3
            *
            */

        const viewRect = this.view!.getBoundingBox();
        const viewRectWorld = viewRect.transformMat4(this.view!.node.worldMatrix);
        const contentWorldMatrix = mat4(this.content!.worldMatrix);
        const contentInvWorldMatrix = contentWorldMatrix.invert();
        this.refRect = viewRectWorld.transformMat4(contentInvWorldMatrix);

        // const cor0 = new Vec3();
        // this.view.convertToWorldSpaceAR(Vec3.ZERO, cor0);
        // const cor1 = new Vec3();
        // this.view.convertToWorldSpaceAR(new Vec3(this.view.contentSize.x, this.view.contentSize.y), cor1);
        // const rcor0 = new Vec3();
        // const rcor1 = new Vec3();
        // this.content.inverseTransformPoint(rcor0, cor0);
        // this.content.inverseTransformPoint(rcor1, cor1);
        // this.refRect = new Rect(rcor0.x, rcor0.y, rcor1.x - rcor0.x, rcor1.y - rcor0.y);
    }

    private MovePos(pos: Vec2, size: Size): Vec2 {
        // 注意 所有的rect都是左下角为基准
        switch (this.layoutType) {
            case ItemLayoutType.Vertical:
                // 垂直方向 向下移动
                pos.y -= size.y;
                break;
            case ItemLayoutType.Horizontal:
                // 水平方向 向右移动
                pos.x += size.x;
                break;
            case ItemLayoutType.VerticalThenHorizontal:
                pos.y -= size.y;
                if (pos.y - size.y < -this.refRect.height) {
                    pos.y = 0;
                    pos.x += size.x;
                }

                break;
            case ItemLayoutType.HorizontalThenVertical:

                pos.x += size.x;
                if (pos.x + size.x > this.refRect.width) {
                    pos.x = 0;
                    pos.y -= size.y;
                }

                break;
            default:
                break;
        }

        return pos;
    }

    private IsActive(): boolean {
        // return this.node.active && this.enabled;
        return this.enabledInHierarchy;
    }
}
