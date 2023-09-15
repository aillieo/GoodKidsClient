import { _decorator, Component, Toggle } from "cc";
import { Binder } from "../../aillieo-utils/Binder";
import { Property } from "../../aillieo-utils/Property";
import { BasePage } from "./BasePage";
import { Logger } from "../misc/Logger";
const { ccclass, property } = _decorator;

@ccclass("UIMainView")
export class UIMainView extends Component {
    @property({
        type: [BasePage]
    })
    public pages: BasePage[] = [];

    @property({
        type: [Toggle]
    })
    public tabs: Toggle[] = [];

    private prop : Property<number>;

    private binder : Binder;

    private state : boolean;

    constructor() {
        super();
        this.prop = new Property<number>(0);
        this.binder = new Binder();
        this.state = false;
    }

    onLoad() {
        this.schedule(() => {
            this.state = !this.state;
        }, 3);
    }

    protected onEnable() : void {
        this.binder.bindProperty(this.prop, () => {
            const v = this.prop.get();
            Logger.get(UIMainView).log(v);
        });

        for (let i = 0; i < 5; ++i) {
            const toggle : Toggle = this.tabs[i];
            const page : BasePage = this.pages[i];
            toggle.node.on("toggle", (t : Toggle) => {
                page.node.active = t.isChecked;
            }, this);
        }
    }

    protected onDisable() : void {
        this.binder.clear();
    }

    public onClick22() {
        let v = this.prop.get();
        v += 1;
        this.prop.set(v);
    }
}
