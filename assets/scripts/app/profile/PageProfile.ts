import { _decorator, Label, Button, EditBox } from "cc";
import { BasePage } from "../main/BasePage";
import { SessionManager } from "../misc/SessionManager";
import { Logger } from "../misc/Logger";
const { ccclass, property } = _decorator;

@ccclass("PageProfile")
export class PageProfile extends BasePage {
    @property(Label)
        labelName: Label|null = null;

    @property(Label)
        labelScore: Label|null = null;

    @property(EditBox)
        editBoxName: EditBox|null = null;

    @property(EditBox)
        editBoxPassword: EditBox|null = null;

    @property(Button)
        buttonLogin: Button|null = null;

    @property(Button)
        buttonRegister: Button|null = null;

    protected onEnable(): void {
        super.onEnable();

        this.editBoxName!.string = localStorage.getItem("username") || "";
        this.editBoxPassword!.string = localStorage.getItem("password") || "";

        this.binder.bindV_ButtonClick(this.buttonRegister!, () => this.onRegisterClick());
        this.binder.bindV_ButtonClick(this.buttonLogin!, () => this.onLoginClick());
    }

    protected onDisable():void {
        this.binder.clear();
    }

    private async loadData(isReg:boolean) {
        const dm : SessionManager = SessionManager.getInstance();

        const u:string = this.editBoxName!.string;
        const p:string = this.editBoxPassword!.string;

        const succ : boolean = await dm.getUserData(u, p, isReg);
        Logger.get(PageProfile).log(succ);
    }

    private onRegisterClick():void {
        localStorage.setItem("username", this.editBoxName!.string);
        localStorage.setItem("password", this.editBoxPassword!.string);

        Logger.get(PageProfile).log(this);

        this.loadData(true);
    }

    private onLoginClick():void {
        localStorage.setItem("username", this.editBoxName!.string);
        localStorage.setItem("password", this.editBoxPassword!.string);

        Logger.get(PageProfile).log(this);

        this.loadData(false);
    }
}
