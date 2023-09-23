import { _decorator, Label, Button, EditBox } from "cc";
import { BasePage } from "../main/BasePage";
import { SessionManager } from "../misc/SessionManager";
import { Logger } from "../misc/Logger";
import { Models } from "../model/Models";
import { UserModel } from "../model/UserModel";
import { UIManager } from "../uiframework/UIManager";
import { UIItemCreate } from "./UIItemCreate";
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

    @property(Button)
        buttonCreateItem: Button|null = null;

    protected onEnable(): void {
        super.onEnable();

        this.editBoxName!.string = localStorage.getItem("username") || "";
        this.editBoxPassword!.string = localStorage.getItem("password") || "";

        this.binder.bindV_ButtonClick(this.buttonRegister!, () => this.onRegisterClick());
        this.binder.bindV_ButtonClick(this.buttonLogin!, () => this.onLoginClick());
        this.binder.bindV_ButtonClick(this.buttonCreateItem!, () => this.onCreateItemClick());

        this.binder.bindProperty(Models.get(UserModel).userData, () => this.onUserDateUpdate());
    }

    protected onDisable():void {
        this.binder.clear();
    }

    private async loadData(isReg:boolean) {
        const u:string = this.editBoxName!.string;
        const p:string = this.editBoxPassword!.string;

        const succ : boolean = await SessionManager.getInstance().login(u, p, isReg);
        if (succ) {
            await Models.get(UserModel).getUser();
        }
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

    private onUserDateUpdate() : void {
        const userData = Models.get(UserModel).userData.get();
        if (userData) {
            this.labelName!.string = userData.username;
            this.labelScore!.string = userData.avatar;

            this.buttonCreateItem!.node.active = true;
        } else {
            this.labelName!.string = "-";
            this.labelScore!.string = "-";

            this.buttonCreateItem!.node.active = false;
        }
    }

    private onCreateItemClick() : void {
        UIManager.getInstance().open(UIItemCreate);
    }
}
