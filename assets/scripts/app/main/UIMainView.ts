import { _decorator, Component, Node, Label, log, Button } from "cc";
import { Binder} from "../../aillieo-utils/Binder";
import { Property } from "../../aillieo-utils/Property";
import { AppManager } from "../AppManager";
const { ccclass, property } = _decorator;

@ccclass("UIMainView")
export class UIMainView extends Component {
    @property(Label)
    public testLabel: Label = null!;

    @property(Button)
    public testButton: Button = null!;

    private prop : Property<number>;

    private binder : Binder;

    private state : boolean;

    start() {
        this.prop = new Property<number>(0);
        this.binder = new Binder();
        this.state = false;

        this.schedule(() => {
            this.state = !this.state;
        }, 3);

        this.binder.bindProperty(this.prop, () => {
            const v = this.prop.get();
            this.testLabel.string = v + " " + this.state;
            console.log(this.state);
        });

    }

    protected onEnable() : void {

    }

    protected onDisable() : void {
    }

    public onClick22() {
        let v = this.prop.get();
        v += 1;
        this.prop.set(v);
    }
}
